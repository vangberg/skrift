import { ipcMain, app } from "electron";
import { NotesFS } from "../interfaces/notes_fs";
import {
  IpcSearch,
  IpcSearchResults,
  IpcCommand,
  IpcEvent,
  IpcLoadNoteCommand,
  IpcDeleteNoteCommand,
  IpcSetNoteCommand,
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

const reply = (event: Electron.IpcMainEvent, msg: IpcEvent) => {
  event.reply("skrift", msg);
};

const handleLoadDir = async (event: Electron.IpcMainEvent) => {
  const db = await getDB();
  const notes = [];

  for await (let note of NotesFS.readDir(_path)) {
    await NotesDB.save(db, note.id, note.slate, note.modifiedAt);
    notes.push(note);
  }

  reply(event, { type: "event/LOADED_DIR", notes });
};

const handleLoadNote = async (
  event: Electron.IpcMainEvent,
  cmd: IpcLoadNoteCommand
) => {
  const { id } = cmd;
  const db = await getDB();

  const note = await NotesDB.get(db, id);
  reply(event, { type: "event/SET_NOTE", note });
};

const handleDeleteNote = async (
  event: Electron.IpcMainEvent,
  cmd: IpcDeleteNoteCommand
) => {
  const { id } = cmd;
  const db = await getDB();

  await NotesDB.delete(db, id);
  await NotesFS.delete(_path, id);

  reply(event, { type: "event/DELETED_NOTE", id });
};

const handleSetNote = async (
  event: Electron.IpcMainEvent,
  cmd: IpcSetNoteCommand
) => {
  const { id, slate } = cmd;
  const db = await getDB();

  await NotesDB.save(db, id, slate);
  NotesFS.save(_path, id, slate);

  const note = await NotesDB.get(db, id);

  reply(event, { type: "event/SET_NOTE", note });
};

const handleSearch = async (event: Electron.IpcMainEvent, arg: IpcSearch) => {
  const { query } = arg;
  const db = await getDB();

  const ids = await NotesDB.search(db, query);
  const message: IpcSearchResults = { ids };
  event.reply(`search-results`, message);
};

export const setupIpc = () => {
  ipcMain.on("skrift", (event, command: IpcCommand) => {
    switch (command.type) {
      case "command/LOAD_DIR":
        handleLoadDir(event);
        break;
      case "command/LOAD_NOTE":
        handleLoadNote(event, command);
        break;
      case "command/SET_NOTE":
        handleSetNote(event, command);
        break;
      case "command/DELETE_NOTE":
        handleDeleteNote(event, command);
        break;
    }
  });
  ipcMain.on("search", handleSearch);
};
