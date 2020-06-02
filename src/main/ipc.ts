import { ipcMain } from "electron";
import { NotesFS } from "../interfaces/notes_fs";
import { IpcLoadNote, IpcSetNote, IpcLoadedNote, IpcLoadedDir } from "../types";
import { Database } from "sqlite";
import { NotesDB } from "../interfaces/notes_db";

const dbs: Map<string, Database> = new Map();

const getDB = async (path: string): Promise<Database> => {
  let db = dbs.get(path);

  if (!db) {
    db = await NotesDB.memory();
    await NotesDB.initialize(db);
    dbs.set(path, db);
  }

  return db;
};

const handleLoadDir = async (event: Electron.IpcMainEvent, path: string) => {
  const db = await getDB(path);
  const notes = [];

  for await (let note of NotesFS.readDir(path)) {
    NotesDB.save(db, note.id, note.slate, note.modifiedAt);
    notes.push(note);
  }

  const message: IpcLoadedDir = { notes };
  event.reply("loaded-dir", message);
};

const handleLoadNote = async (
  event: Electron.IpcMainEvent,
  arg: IpcLoadNote
) => {
  console.log("loading note", arg);
  const { path, id } = arg;
  const db = await getDB(path);

  const note = await NotesDB.get(db, id);
  const message: IpcLoadedNote = { note };
  event.reply(`loaded-note/${id}`, message);
};

const handleSetNote = async (event: Electron.IpcMainEvent, arg: IpcSetNote) => {
  const { path, id, slate } = arg;
  const db = await getDB(path);

  NotesDB.save(db, id, slate);
  NotesFS.save(path, id, slate);

  const note = await NotesDB.get(db, id);
  const message: IpcLoadedNote = { note };
  event.reply("loaded-note", message);
};

export const setupIpc = () => {
  ipcMain.on("load-dir", handleLoadDir);
  ipcMain.on("load-note", handleLoadNote);
  ipcMain.on("set-note", handleSetNote);
};
