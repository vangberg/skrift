import { ipcMain, app } from "electron";
import {
  IpcCommand,
  IpcReply,
  IpcLoadNoteCommand,
  IpcAddNoteCommand,
  IpcDeleteNoteCommand,
  IpcSetNoteCommand,
} from "../shared/types";
import { Database } from "sqlite";
import path from "path";
import { TSet } from "../../skrift/tset";
import { Note } from "../../skrift/note";
import { NotesDB } from "../../skrift/notes_db";
import { NotesFS } from "../../skrift/notes_fs";

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

  await NotesDB.transaction(db, async () => {
    let loaded = 0;
    for await (let note of NotesFS.readDir(_path)) {
      await NotesDB.save(db, note.id, note.markdown, note.modifiedAt);
      loaded += 1;
      if (loaded % 100 === 0) {
        reply(event, { type: "event/LOADING_DIR", loaded });
      }
    }
  });

  reply(event, { type: "event/LOADED_DIR" });
};

const handleLoadNote = async (
  event: Electron.IpcMainEvent,
  cmd: IpcLoadNoteCommand
) => {
  const { id } = cmd;
  const db = await getDB();

  const note = await NotesDB.getWithLinks(db, id);
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

  note.linkIds.forEach(async (linkId) => {
    const note = await NotesDB.getWithLinks(db, linkId);
    reply(event, { type: "event/SET_NOTE", note });
  });

  reply(event, { type: "event/DELETED_NOTE", id });
};

const handleAddNote = async (
  event: Electron.IpcMainEvent,
  cmd: IpcAddNoteCommand
) => {
  const { id, markdown } = cmd;
  const db = await getDB();

  await NotesDB.transaction(db, () => NotesDB.save(db, id, markdown));

  await NotesFS.save(_path, id, markdown);

  const note = await NotesDB.getWithLinks(db, id);

  reply(event, { type: "event/SET_NOTE", note });
};

const handleSetNote = async (
  event: Electron.IpcMainEvent,
  cmd: IpcSetNoteCommand
) => {
  const { id, markdown } = cmd;
  const db = await getDB();

  const noteBefore = await NotesDB.get(db, id);

  await NotesDB.transaction(db, () => NotesDB.save(db, id, markdown));

  await NotesFS.save(_path, id, markdown);

  const noteAfter = await NotesDB.getWithLinks(db, id);

  const linksDeleted = TSet.difference(noteBefore.linkIds, noteAfter.linkIds);
  const linksAdded = TSet.difference(noteAfter.linkIds, noteBefore.linkIds);
  const linksAffected = TSet.union(linksDeleted, linksAdded);

  reply(event, { type: "event/SET_NOTE", note: noteAfter });

  linksAffected.forEach(async (link) => {
    const note = await NotesDB.getWithLinks(db, link);
    reply(event, { type: "event/SET_NOTE", note });
  });
};

const handleSearch = async (
  event: Electron.IpcMainInvokeEvent,
  query: string
): Promise<Note[]> => {
  const db = await getDB();

  const ids = await NotesDB.search(db, query);
  const notes = await Promise.all(ids.map((id) => NotesDB.get(db, id)));

  return notes;
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
    }
  });

  ipcMain.handle("search", handleSearch);
};
