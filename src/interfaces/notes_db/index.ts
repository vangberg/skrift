import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";
import { Note, NoteID } from "../note";
import { Serializer } from "../serializer";
import { Node } from "slate";
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

  async save(
    db: Database,
    id: NoteID,
    slate: Node[],
    modifiedAt?: Date
  ): Promise<void> {
    const title = Note.title(slate);
    const markdown = Serializer.serialize(slate);
    const links = Note.links(slate);

    await db.exec(`BEGIN`);
    await db.run(`DELETE FROM notes WHERE id = ?`, id);
    await db.run(`DELETE FROM links WHERE fromId = ?`, id);

    await db.run(
      `
      INSERT INTO notes (id, title, markdown, modifiedAt)
      VALUES (?, ?, ?, ?)
      `,
      [id, title, markdown, modifiedAt || new Date()]
    );

    for (const link of links) {
      await db.run(
        `
        INSERT INTO links (fromId, toId)
        VALUES (?, ?)
        `,
        [id, link]
      );
    }

    await db.exec(`COMMIT`);
  },

  async get(db: Database, id: NoteID): Promise<Note> {
    const row = await db.get<NoteRow>(`SELECT * FROM notes WHERE id = ?`, id);

    const backlinks = await db.all<LinkRow[]>(
      `SELECT * FROM links WHERE toId = ?`,
      id
    );

    if (!row) {
      throw new NoteNotFoundError("Woop");
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
    const rows = await db.all<SearchRow[]>(
      `SELECT * FROM notes WHERE notes MATCH ?`,
      `${query}*`
    );

    return rows.map((row) => row.id);
  },
};
