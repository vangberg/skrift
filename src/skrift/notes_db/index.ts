import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";
import { Note, NoteID } from "../note";
import path from "path";

export interface NoteRow {
  id: string;
  title: string;
  markdown: string;
  modifiedAt: string;
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

  async transaction(db: Database, callback: () => Promise<void>) {
    await db.exec("BEGIN");
    await callback();
    await db.exec("COMMIT");
  },

  async save(
    db: Database,
    id: NoteID,
    markdown: string,
    modifiedAt?: Date
  ): Promise<void> {
    const note = Note.fromMarkdown(markdown);

    await db.run(`DELETE FROM notes WHERE id = ?`, id);
    await db.run(`DELETE FROM links WHERE fromId = ?`, id);

    await db.run(
      `
      INSERT INTO notes (id, title, markdown, modifiedAt)
      VALUES (?, ?, ?, ?)
      `,
      [id, note.title, markdown, modifiedAt || new Date()]
    );

    for (const link of note.links) {
      await db.run(
        `
        INSERT INTO links (fromId, toId)
        VALUES (?, ?)
        `,
        [id, link]
      );
    }
  },

  async get(db: Database, id: NoteID): Promise<Note> {
    const row = await db.get<NoteRow>(`SELECT * FROM notes WHERE id = ?`, id);

    const backlinks = await db.all<LinkRow[]>(
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
        backlinks: new Set(backlinks.map(({ fromId }) => fromId)),
        modifiedAt: new Date(parseFloat(modifiedAt)),
      }),
      ...Note.fromMarkdown(markdown),
    };
  },

  async delete(db: Database, id: NoteID): Promise<void> {
    await db.run(`DELETE FROM notes WHERE id = ?`, id);
    await db.run(`DELETE FROM links WHERE toId = ? OR fromId = ?`, id, id);
  },

  async search(db: Database, query: string): Promise<NoteID[]> {
    if (query === "*") {
      return NotesDB.all(db);
    }

    const cleanQuery = query.replace(/[^a-zA-Z0-9\s]/g, " ");

    if (cleanQuery.trim().length === 0) {
      return [];
    }

    const rows = await db.all<SearchRow[]>(
      `SELECT * FROM notes WHERE notes MATCH ?`,
      `${cleanQuery}*`
    );

    return rows.map((row) => row.id);
  },

  async all(db: Database): Promise<NoteID[]> {
    const rows = await db.all<SearchRow[]>(
      "SELECT * FROM notes ORDER BY modifiedAt DESC"
    );

    return rows.map((row) => row.id);
  },
};
