import { ipcMain, app } from "electron";
import { NotesFS } from "../interfaces/notes_fs";
import {
  IpcLoadNote,
  IpcSetNote,
  IpcLoadedNote,
  IpcLoadedDir,
  IpcSearch,
  IpcSearchResults,
  IpcDeleteNote,
} from "../types";
import { Database } from "sqlite";
import { NotesDB } from "../interfaces/notes_db";
import path from "path";

let _path = path.join(app.getPath("documents"), "Skrift");

const getDB: () => Promise<Database> = (() => {
  let db: Database;

  return async (): Promise<Database> => {
    if (!db) {
      db = await NotesDB.file(_path);
      await NotesDB.initialize(db);
    }

    return db;
  };
})();

const handleLoadDir = async (event: Electron.IpcMainEvent) => {
  const db = await getDB();
  const notes = [];

  for await (let note of NotesFS.readDir(_path)) {
    await NotesDB.save(db, note.id, note.slate, note.modifiedAt);
    notes.push(note);
  }

  const message: IpcLoadedDir = { notes };
  event.reply("loaded-dir", message);
};

const handleLoadNote = async (
  event: Electron.IpcMainEvent,
  arg: IpcLoadNote
) => {
  const { id } = arg;
  const db = await getDB();

  const note = await NotesDB.get(db, id);
  const message: IpcLoadedNote = { note };
  event.reply(`loaded-note/${id}`, message);
};

const handleDeleteNote = async (
  event: Electron.IpcMainEvent,
  arg: IpcDeleteNote
) => {
  const { id } = arg;
  const db = await getDB();

  await NotesDB.delete(db, id);
  await NotesFS.delete(_path, id);
  event.reply(`deleted-note`);
};

const handleSetNote = async (event: Electron.IpcMainEvent, arg: IpcSetNote) => {
  const { id, slate } = arg;
  const db = await getDB();

  await NotesDB.save(db, id, slate);
  NotesFS.save(_path, id, slate);

  const note = await NotesDB.get(db, id);
  const message: IpcLoadedNote = { note };
  event.reply(`loaded-note`, message);
  event.reply(`loaded-note/${id}`, message);
};

const handleSearch = async (event: Electron.IpcMainEvent, arg: IpcSearch) => {
  const { query } = arg;
  const db = await getDB();

  const ids = await NotesDB.search(db, query);
  const message: IpcSearchResults = { ids };
  event.reply(`search-results`, message);
};

export const setupIpc = () => {
  ipcMain.on("load-dir", handleLoadDir);
  ipcMain.on("load-note", handleLoadNote);
  ipcMain.on("set-note", handleSetNote);
  ipcMain.on("delete-note", handleDeleteNote);
  ipcMain.on("search", handleSearch);
};
