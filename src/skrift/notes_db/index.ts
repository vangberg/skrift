import BetterSqlite3 from "better-sqlite3";
import * as sqliteVec from "sqlite-vec";
import { Note, NoteID, NoteLink, NoteWithLinks } from "../note/index.js";
import path from "path";
import { Fts } from "./fts.js";
import { ParsedNote } from "../note/fromMarkdown.js";
import { createHash } from "crypto";
import { pipeline } from "@huggingface/transformers";

export interface NoteRow {
  id: string;
  title: string;
  markdown: string;
  modifiedAt: string;
  checksum: string;
}

export interface NoteLinkRow {
  id: string;
  title: string;
}

export interface SearchRow {
  id: string;
  title: string;
  markdown: string;
  modifiedAt: string;
}

export interface EmbeddingRow {
  id: string;
  embedding: Float32Array;
}

export interface LinkRow {
  fromId: string;
  toId: string;
}

export class NoteNotFoundError extends Error {
  constructor(message?: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export const NotesDB = {
  memory(): BetterSqlite3.Database {
    return new BetterSqlite3(":memory:");
  },

  file(dirPath: string): BetterSqlite3.Database {
    const dbPath = path.join(dirPath, "skrift.db");
    return new BetterSqlite3(dbPath);
  },

  initialize(db: BetterSqlite3.Database): void {
    sqliteVec.load(db)

    db.prepare(
      `CREATE VIRTUAL TABLE IF NOT EXISTS notes USING fts5(
        id UNINDEXED,
        title,
        markdown,
        modifiedAt UNINDEXED,
        checksum UNINDEXED
      );
      `
    ).run();

    db.prepare(
      `CREATE VIRTUAL TABLE IF NOT EXISTS notes_embeddings USING vec0(
        embedding float[384]
      )`
    ).run();

    db.prepare(
      `CREATE TABLE IF NOT EXISTS links (
        fromId TEXT NOT NULL,
        toId TEXT NOT NULL,
        PRIMARY KEY (fromId, toId)
      )`
    ).run();
  },

  dropTables(db: BetterSqlite3.Database): void {
    db.prepare("DROP TABLE IF EXISTS notes").run();
    db.prepare("DROP TABLE IF EXISTS notes_embeddings").run();
    db.prepare("DROP TABLE IF EXISTS links").run();
  },

  getRowid(db: BetterSqlite3.Database, id: NoteID): bigint {
    const result = db.prepare("SELECT rowid FROM notes WHERE id = ?").run(id);
    return BigInt(result.lastInsertRowid);
  },

  async save(
    db: BetterSqlite3.Database,
    id: NoteID,
    markdown: string,
    modifiedAt?: Date
  ): Promise<void> {
    const note = Note.fromMarkdown(markdown);
    const checksum = NotesDB.computeChecksum(markdown);
    const embedding = await NotesDB.computeEmbedding(markdown);

    return db.transaction((note: ParsedNote) => {
      db.prepare("DELETE FROM notes WHERE id = ?").run(id);
      db.prepare("DELETE FROM links WHERE fromId = ?").run(id);
      db.prepare("DELETE FROM notes_embeddings WHERE rowid = ?").run(NotesDB.getRowid(db, id));

      const result = db.prepare(
        `INSERT INTO notes (id, title, markdown, modifiedAt, checksum) VALUES (?, ?, ?, ?, ?)`
      ).run([id, note.title, markdown, (modifiedAt || new Date()).getTime(), checksum]);

      const rowid = result.lastInsertRowid;
      db.prepare("INSERT INTO notes_embeddings (rowid, embedding) VALUES (?, ?)").run([BigInt(rowid), embedding]);

      note.linkIds.forEach((link) =>
        db.prepare("INSERT INTO links (fromId, toId) VALUES (?, ?)").run([id, link])
      );
    })(note);
  },

  exists(db: BetterSqlite3.Database, id: NoteID): boolean {
    const row = db.prepare<NoteID, NoteRow>(`SELECT id FROM notes WHERE id = ?`).get(id);

    return !!row;
  },

  get(db: BetterSqlite3.Database, id: NoteID): Note {
    const row = db.prepare<string, NoteRow>(`SELECT * FROM notes WHERE id = ?`).get(id);

    const backlinkIds = db
      .prepare<string, LinkRow>(`SELECT * FROM links WHERE toId = ?`)
      .all(id);

    if (!row) {
      throw new NoteNotFoundError("Could not find note");
    }

    const { markdown, modifiedAt } = row;

    return {
      ...Note.empty({
        id,
        backlinkIds: new Set(backlinkIds.map(({ fromId }) => fromId)),
        modifiedAt: new Date(parseInt(modifiedAt)),
      }),
      ...Note.fromMarkdown(markdown),
    };
  },

  getNoteLinks(db: BetterSqlite3.Database, ids: NoteID[]): NoteLink[] {
    const links = db
      .prepare<[string[]], NoteLinkRow>(
        `SELECT id, title FROM notes WHERE id IN (${[...ids].fill("?")})`
      )
      .all(ids);

    // `WHERE id IN (2, 1)` returns rows sorted by id, and not in the
    // specified order, so we need to do that manually.
    const positions = new Map<string, number>();
    ids.forEach((id, idx) => positions.set(id, idx));
    return links.sort((a, b) => positions.get(a.id)! - positions.get(b.id)!);
  },

  getWithLinks(db: BetterSqlite3.Database, id: NoteID): NoteWithLinks {
    const note = NotesDB.get(db, id);
    const links = NotesDB.getNoteLinks(db, [...note.linkIds]);
    const backlinks = NotesDB.getNoteLinks(db, [...note.backlinkIds]);

    return {
      ...note,
      links,
      backlinks,
    };
  },

  delete(db: BetterSqlite3.Database, id: NoteID): void {
    const rowid = NotesDB.getRowid(db, id);

    db.prepare(`DELETE FROM notes WHERE id = ?`).run(id);
    db.prepare(`DELETE FROM links WHERE toId = ? OR fromId = ?`).run(id, id);
    db.prepare(`DELETE FROM notes_embeddings WHERE rowid = ?`).run(rowid);
  },

  search(db: BetterSqlite3.Database, query: string): NoteID[] {
    if (query === "*") {
      return NotesDB.recent(db);
    }

    const tokens = Fts.parse(query);

    if (tokens.length === 0) {
      return [];
    }

    const rows = db
      .prepare<string, SearchRow>(`SELECT * FROM notes WHERE notes MATCH ? ORDER BY rank LIMIT 50`)
      .all(Fts.toMatch(tokens));

    return rows.map((row) => row.id);
  },

  async searchSemantic(db: BetterSqlite3.Database, query: string, topK: number = 10): Promise<NoteID[]> {
    const embedding = await NotesDB.computeEmbedding(query);

    const rows = db.prepare<Float32Array, EmbeddingRow>(`
        SELECT
        id,
        ROW_NUMBER() OVER (ORDER BY e.distance ASC) AS rank
        FROM notes n
        INNER JOIN (
            SELECT rowid, distance
            FROM notes_embeddings
            WHERE embedding MATCH ?
            ORDER BY distance ASC
            LIMIT ?
        ) e ON n.id = e.rowid
        ORDER BY e.distance ASC
    `).all(embedding);

    return rows.map((row) => row.id as NoteID);
  },

  recent(db: BetterSqlite3.Database): NoteID[] {
    const rows = db
      .prepare<[], SearchRow>(
        "SELECT * FROM notes ORDER BY modifiedAt DESC LIMIT 50"
      )
      .all();

    return rows.map((row) => row.id);
  },

  computeChecksum(markdown: string): string {
    return createHash("md5").update(markdown).digest("hex");
  },

  // Does this really belong in `NotesDB`?
  async computeEmbedding(markdown: string): Promise<Float32Array> {
    const model = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2", { dtype: "fp16" });
    const output = await model(markdown, { pooling: "mean", normalize: true });
    return new Float32Array(output.data);
  },

  async *loadDir(db: BetterSqlite3.Database, notes: AsyncIterable<Note>): AsyncGenerator<number, number> {
    const existingNotes = new Set<string>(
      db.prepare<[], { id: string }>("SELECT id FROM notes").all().map(row => row.id)
    );

    let loaded = 0;
    let batchSize = 0;
    for await (const note of notes) {
      const checksum = NotesDB.computeChecksum(note.markdown);
      const existing = db.prepare<[string], { checksum: string }>("SELECT checksum FROM notes WHERE id = ?").get(note.id);

      if (!existing) {
        // New note
        await NotesDB.save(db, note.id, note.markdown, note.modifiedAt);
        loaded++;
        batchSize++;
      } else if (existing.checksum !== checksum) {
        // Modified note
        await NotesDB.save(db, note.id, note.markdown, note.modifiedAt);
        loaded++;
        batchSize++;
      }
      existingNotes.delete(note.id);

      if (batchSize >= 10) {
        yield loaded;
        batchSize = 0;
      }
    }

    // Delete notes that no longer exist in the filesystem
    for (const id of existingNotes) {
      NotesDB.delete(db, id);
      loaded++;
      batchSize++;

      if (batchSize >= 10) {
        yield loaded;
        batchSize = 0;
      }
    }

    return loaded;
  },
};
