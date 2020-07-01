import { ipcMain } from "electron";
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

const dbs: Map<string, Database> = new Map();

const getDB = async (path: string): Promise<Database> => {
  let db = dbs.get(path);

  if (!db) {
    db = await NotesDB.file(path);
    await NotesDB.initialize(db);
    dbs.set(path, db);
  }

  return db;
};

const handleLoadDir = async (event: Electron.IpcMainEvent, path: string) => {
  const db = await getDB(path);
  const notes = [];

  for await (let note of NotesFS.readDir(path)) {
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
  const { path, id } = arg;
  const db = await getDB(path);

  const note = await NotesDB.get(db, id);
  const message: IpcLoadedNote = { note };
  event.reply(`loaded-note/${id}`, message);
};

const handleDeleteNote = async (
  event: Electron.IpcMainEvent,
  arg: IpcDeleteNote
) => {
  const { path, id } = arg;
  const db = await getDB(path);

  await NotesDB.delete(db, id);
  await NotesFS.delete(path, id);
  event.reply(`deleted-note`);
};

const handleSetNote = async (event: Electron.IpcMainEvent, arg: IpcSetNote) => {
  const { path, id, slate } = arg;
  const db = await getDB(path);

  await NotesDB.save(db, id, slate);
  NotesFS.save(path, id, slate);

  const note = await NotesDB.get(db, id);
  const message: IpcLoadedNote = { note };
  event.reply(`loaded-note`, message);
  event.reply(`loaded-note/${id}`, message);
};

const handleSearch = async (event: Electron.IpcMainEvent, arg: IpcSearch) => {
  const { path, query } = arg;
  const db = await getDB(path);

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
