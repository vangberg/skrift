import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";
import { Note, NoteID, NoteLink, NoteWithLinks } from "../note";
import path from "path";
import { Fts } from "./fts";

export interface NoteRow {
  id: string;
  title: string;
  markdown: string;
  modifiedAt: string;
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
  async memory(): Promise<Database> {
    return open({
      filename: ":memory:",
      driver: sqlite3.Database,
    });
  },

  async file(dirPath: string): Promise<Database> {
    const dbPath = path.join(dirPath, "skrift.db");
    return open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
  },

  async initialize(db: Database): Promise<void> {
    await db.run("DROP TABLE IF EXISTS notes");
    await db.run(
      `CREATE VIRTUAL TABLE notes USING fts5(
        id UNINDEXED,
        title,
        markdown,
        modifiedAt UNINDEXED
      )`
    );

    await db.run("DROP TABLE IF EXISTS links");
    await db.run(`
      CREATE TABLE links (
        fromId TEXT NOT NULL,
        toId TEXT NOT NULL,
        PRIMARY KEY (fromId, toId)
      )
    `);
  },

  async save(
    db: Database,
    id: NoteID,
    markdown: string,
    modifiedAt?: Date
  ): Promise<void> {
    const note = Note.fromMarkdown(markdown);
    const driver = db.getDatabaseInstance();

    return new Promise((resolve, reject) => {
      driver.serialize(() => {
        const promises = [
          db.run("BEGIN"),
          db.run(`DELETE FROM notes WHERE id = ?`, id),
          db.run(`DELETE FROM links WHERE fromId = ?`, id),
          db.run(
            `INSERT INTO notes (id, title, markdown, modifiedAt) VALUES (?, ?, ?, ?)`,
            [id, note.title, markdown, (modifiedAt || new Date()).getTime()]
          ),
          ...[...note.linkIds].map((link) =>
            db.run(`INSERT INTO links (fromId, toId) VALUES (?, ?)`, [id, link])
          ),
          db.run("COMMIT"),
        ];

        Promise.all(promises)
          .then(() => resolve())
          .catch(reject);
      });
    });
  },

  async exists(db: Database, id: NoteID): Promise<boolean> {
    const row = await db.get<NoteID>(`SELECT id FROM notes WHERE id = ?`, id);

    return !!row;
  },

  async get(db: Database, id: NoteID): Promise<Note> {
    const row = await db.get<NoteRow>(`SELECT * FROM notes WHERE id = ?`, id);

    const backlinkIds = await db.all<LinkRow[]>(
      `SELECT * FROM links WHERE toId = ?`,
      id
    );

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

  async getNoteLinks(db: Database, ids: NoteID[]): Promise<NoteLink[]> {
    const links = await db.all<NoteLinkRow[]>(
      `SELECT id, title FROM notes WHERE id IN (${[...ids].fill("?")})`,
      ids
    );

    // `WHERE id IN (2, 1)` returns rows sorted by id, and not in the
    // specified order, so we need to do that manually.
    const positions = new Map<string, number>();
    ids.forEach((id, idx) => positions.set(id, idx));
    return links.sort((a, b) => positions.get(a.id)! - positions.get(b.id)!);
  },

  async getWithLinks(db: Database, id: NoteID): Promise<NoteWithLinks> {
    const note = await NotesDB.get(db, id);
    const links = await NotesDB.getNoteLinks(db, [...note.linkIds]);
    const backlinks = await NotesDB.getNoteLinks(db, [...note.backlinkIds]);

    return {
      ...note,
      links,
      backlinks,
    };
  },

  async delete(db: Database, id: NoteID): Promise<void> {
    await db.run(`DELETE FROM notes WHERE id = ?`, id);
    await db.run(`DELETE FROM links WHERE toId = ? OR fromId = ?`, id, id);
  },

  async search(db: Database, query: string): Promise<NoteID[]> {
    if (query === "*") {
      return NotesDB.recent(db);
    }

    const tokens = Fts.parse(query);

    if (tokens.length === 0) {
      return [];
    }

    const rows = await db.all<SearchRow[]>(
      `SELECT * FROM notes WHERE notes MATCH ? LIMIT 50`,
      Fts.toMatch(tokens)
    );

    return rows.map((row) => row.id);
  },

  async recent(db: Database): Promise<NoteID[]> {
    const rows = await db.all<SearchRow[]>(
      "SELECT * FROM notes ORDER BY modifiedAt DESC LIMIT 50"
    );

    return rows.map((row) => row.id);
  },
};
