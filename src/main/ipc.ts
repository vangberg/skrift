import { ipcMain, app } from "electron";
import { NotesFS } from "../interfaces/notes_fs";
import {
  IpcCommand,
  IpcReply,
  IpcLoadNoteCommand,
  IpcAddNoteCommand,
  IpcDeleteNoteCommand,
  IpcSetNoteCommand,
  IpcSearchCommand,
} from "../types";
import { Database } from "sqlite";
import { NotesDB } from "../interfaces/notes_db";
import path from "path";
import { TSet } from "../tset";

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

const reply = (event: Electron.IpcMainEvent, reply: IpcReply) => {
  event.reply("skrift", reply);
};

const handleLoadDir = async (event: Electron.IpcMainEvent) => {
  await NotesFS.initialize(_path);
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

  const note = await NotesDB.get(db, id);
  await NotesDB.delete(db, id);
  await NotesFS.delete(_path, id);

  note.links.forEach((link) => {
    reply(event, { type: "event/DELETED_LINK", from: id, to: link });
  });
  reply(event, { type: "event/DELETED_NOTE", id });
};

const handleAddNote = async (
  event: Electron.IpcMainEvent,
  cmd: IpcAddNoteCommand
) => {
  const { id, slate } = cmd;
  const db = await getDB();

  await NotesDB.save(db, id, slate);
  NotesFS.save(_path, id, slate);

  const note = await NotesDB.get(db, id);

  reply(event, { type: "event/SET_NOTE", note });
};

const handleSetNote = async (
  event: Electron.IpcMainEvent,
  cmd: IpcSetNoteCommand
) => {
  const { id, slate } = cmd;
  const db = await getDB();

  const noteBefore = await NotesDB.get(db, id);

  await NotesDB.save(db, id, slate);
  await NotesFS.save(_path, id, slate);

  const noteAfter = await NotesDB.get(db, id);

  const linksDeleted = TSet.difference(noteBefore.links, noteAfter.links);
  const linksAdded = TSet.difference(noteAfter.links, noteBefore.links);

  reply(event, { type: "event/SET_NOTE", note: noteAfter });
  linksDeleted.forEach((link) => {
    reply(event, { type: "event/DELETED_LINK", from: id, to: link });
  });
  linksAdded.forEach((link) => {
    reply(event, { type: "event/ADDED_LINK", from: id, to: link });
  });
};

const handleSearch = async (
  event: Electron.IpcMainEvent,
  cmd: IpcSearchCommand
) => {
  const { query } = cmd;
  const db = await getDB();

  const ids = await NotesDB.search(db, query);

  reply(event, { type: "event/SEARCH", query, ids });
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
      case "command/ADD_NOTE":
        handleAddNote(event, command);
        break;
      case "command/SET_NOTE":
        handleSetNote(event, command);
        break;
      case "command/DELETE_NOTE":
        handleDeleteNote(event, command);
        break;
      case "command/SEARCH":
        handleSearch(event, command);
        break;
    }
  });
};
