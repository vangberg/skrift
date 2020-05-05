import { Database } from "sqlite3";

export const NotesDB = {
  initialize(db: Database) {
    db.serialize(() => {
      db.run("DROP TABLE IF EXISTS notes");
      db.run(`
        CREATE TABLE notes (
          id TEXT PRIMARY KEY NOT NULL,
          title TEXT NOT NULL,
          markdown TEXT NOT NULL,
          modifiedAt TEXT NOT NULL
        )
      `);
      db.run("DROP TABLE IF EXISTS links");
      db.run(`
        CREATE TABLE links (
          fromId TEXT NOT NULL,
          toId TEXT NOT NULL
        )
      `);
    });
  },
};
