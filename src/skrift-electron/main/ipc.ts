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
import isDev from "electron-is-dev";
import path from "path";
import { TSet } from "../../skrift/tset";
import { Note, NoteLink, NoteWithLinks } from "../../skrift/note";
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

  let loaded = 0;
  for await (let note of NotesFS.readDir(_path)) {
    await NotesDB.save(db, note.id, note.markdown, note.modifiedAt);
    loaded += 1;
    if (loaded % 100 === 0) {
      reply(event, { type: "event/LOADING_DIR", loaded });
    }
  }

  const initialNoteID = "20210108T145053.970Z.md";

  if (await NotesDB.exists(db, initialNoteID)) {
    reply(event, { type: "event/LOADED_DIR", initialNoteID });
  } else {
    reply(event, { type: "event/LOADED_DIR", initialNoteID: null });
  }
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

  await NotesDB.save(db, id, markdown);

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

  await NotesDB.save(db, id, markdown);

  await NotesFS.save(_path, id, markdown);

  const noteAfter = await NotesDB.getWithLinks(db, id);

  const linksAffected = [];

  // If the title is changed, we need to push new versions of all notes
  // that are linking to this note, so they can get the new title.
  if (noteBefore.title !== noteAfter.title) {
    linksAffected.push(...noteAfter.backlinkIds);
  }

  const linksDeleted = TSet.difference(noteBefore.linkIds, noteAfter.linkIds);
  const linksAdded = TSet.difference(noteAfter.linkIds, noteBefore.linkIds);
  linksAffected.push(...TSet.union(linksDeleted, linksAdded));

  reply(event, { type: "event/SET_NOTE", note: noteAfter });

  linksAffected.forEach(async (link) => {
    const note = await NotesDB.getWithLinks(db, link);
    reply(event, { type: "event/SET_NOTE", note });
  });
};

const handleSearch = async (
  event: Electron.IpcMainInvokeEvent,
  query: string
): Promise<NoteLink[]> => {
  const db = await getDB();

  const ids = await NotesDB.search(db, query);
  const links = await NotesDB.getNoteLinks(db, ids);

  return links;
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
