import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";
import { Note } from "../note";

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

  async add(db: Database, note: Note): Promise<void> {
    const { id, title, markdown, modifiedAt } = note;

    await db.run(
      `
      INSERT INTO notes (id, title, markdown, modifiedAt)
      VALUES (?, ?, ?, ?)
      `,
      [id, title, markdown, modifiedAt]
    );
  },
};
