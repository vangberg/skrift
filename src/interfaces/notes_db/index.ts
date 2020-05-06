import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";
import { Note } from "../note";

export interface NoteRow {
  id: string;
  title: string;
  markdown: string;
  modifiedAt: string;
}

export const NotesDB = {
  async memory(): Promise<Database> {
    return open({
      filename: ":memory:",
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
    await db.run("DROP TABLE IF EXISTS links");
    await db.run(`
      CREATE TABLE links (
        fromId TEXT NOT NULL,
        toId TEXT NOT NULL
      )
    `);
  },

  async save(db: Database, note: Note): Promise<void> {
    const { id, title, markdown, modifiedAt } = note;

    await db.run(
      `
      INSERT INTO notes (id, title, markdown, modifiedAt)
      VALUES (?, ?, ?, ?)
      ON CONFLICT (id) DO UPDATE SET
        title = excluded.title,
        markdown = excluded.markdown,
        modifiedAt = excluded.modifiedAt
      `,
      [id, title, markdown, modifiedAt]
    );
  },
};
