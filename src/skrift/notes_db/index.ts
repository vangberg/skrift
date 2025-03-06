import BetterSqlite3 from "better-sqlite3";
import { Note, NoteID, NoteLink, NoteWithLinks } from "../note/index.js";
import path from "path";
import { Fts } from "./fts.js";
import { ParsedNote } from "../note/fromMarkdown.js";
import { createHash } from "crypto";

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
    db.prepare(
      `CREATE VIRTUAL TABLE IF NOT EXISTS notes USING fts5(
        id UNINDEXED,
        title,
        markdown,
        modifiedAt UNINDEXED,
        checksum UNINDEXED
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

  save(
    db: BetterSqlite3.Database,
    id: NoteID,
    markdown: string,
    modifiedAt?: Date
  ): void {
    const note = Note.fromMarkdown(markdown);
    const checksum = NotesDB.computeChecksum(markdown);

    return db.transaction((note: ParsedNote) => {
      db.prepare("DELETE FROM notes WHERE id = ?").run(id);
      db.prepare("DELETE FROM links WHERE fromId = ?").run(id);
      db.prepare(
        `INSERT INTO notes (id, title, markdown, modifiedAt, checksum) VALUES (?, ?, ?, ?, ?)`
      ).run([id, note.title, markdown, (modifiedAt || new Date()).getTime(), checksum]);
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
    db.prepare(`DELETE FROM notes WHERE id = ?`).run(id);
    db.prepare(`DELETE FROM links WHERE toId = ? OR fromId = ?`).run(id, id);
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
        NotesDB.save(db, note.id, note.markdown, note.modifiedAt);
        loaded++;
        batchSize++;
      } else if (existing.checksum !== checksum) {
        // Modified note
        NotesDB.save(db, note.id, note.markdown, note.modifiedAt);
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
