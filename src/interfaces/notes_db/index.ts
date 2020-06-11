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
    await db.run(`
      CREATE TABLE notes (
        id TEXT PRIMARY KEY NOT NULL,
        title TEXT NOT NULL,
        markdown TEXT NOT NULL,
        modifiedAt TEXT NOT NULL
      )
    `);

    await db.run("DROP TABLE IF EXISTS search");
    await db.run(
      `CREATE VIRTUAL TABLE search USING fts5(
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

    await Promise.all([
      db.run(`DELETE FROM search WHERE id = ?`, id),
      db.run(`DELETE FROM links WHERE fromId = ?`, id),
    ]);

    await Promise.all([
      db.run(
        `
        INSERT INTO notes (id, title, markdown, modifiedAt)
        VALUES (?, ?, ?, ?)
        ON CONFLICT (id) DO UPDATE SET
          title = excluded.title,
          markdown = excluded.markdown,
          modifiedAt = excluded.modifiedAt
        `,
        [id, title, markdown, modifiedAt || new Date()]
      ),
      db.run(
        `
        INSERT INTO search (id, title, markdown, modifiedAt)
        VALUES (?, ?, ?, ?)
        `,
        [id, title, markdown, modifiedAt || new Date()]
      ),
      ...[...links].map((link) =>
        db.run(
          `
          INSERT INTO links (fromId, toId)
          VALUES (?, ?)
          `,
          [id, link]
        )
      ),
    ]);
  },

  async get(db: Database, id: NoteID): Promise<Note> {
    const row = await db.get<NoteRow>(`SELECT * FROM notes WHERE id = ?`, id);
    const backlinks = await db.all<LinkRow[]>(
      `SELECT * FROM links WHERE toId = ?`,
      id
    );

    if (!row) {
      return Promise.reject(`Could not find note with id ${id}`);
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

  async search(db: Database, query: string): Promise<NoteID[]> {
    const rows = await db.all<SearchRow[]>(
      `SELECT * FROM search WHERE search MATCH ?`,
      `${query}*`
    );

    return rows.map((row) => row.id);
  },
};
