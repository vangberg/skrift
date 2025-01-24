import { ipcMain, app, dialog, clipboard } from "electron";
import {
  IpcCommand,
  IpcReply,
  IpcLoadNoteCommand,
  IpcAddNoteCommand,
  IpcDeleteNoteCommand,
  IpcSetNoteCommand,
} from "../shared/types.js";
import BetterSqlite3 from "better-sqlite3";
import path from "path";
import { TSet } from "../../skrift/tset.js";
import { Note, NoteLink, NoteWithLinks } from "../../skrift/note/index.js";
import { NotesDB } from "../../skrift/notes_db/index.js";
import { NotesFS } from "../../skrift/notes_fs/index.js";

const dir = app.isPackaged ? "Skrift" : "Skrift.dev";
const _path = path.join(app.getPath("documents"), dir);

const getDB = (() => {
  let db: BetterSqlite3.Database;

  return (): BetterSqlite3.Database => {
    if (!db) {
      db = NotesDB.file(_path);
      NotesDB.initialize(db);
    }

    return db;
  };
})();

const reply = (event: Electron.IpcMainEvent, reply: IpcReply) => {
  event.reply("skrift", reply);
};

const handleLoadDir = async (event: Electron.IpcMainEvent) => {
  NotesFS.initialize(_path);
  const db = getDB();

  for await (const loaded of NotesDB.loadDir(db, NotesFS.readDir(_path))) {
    reply(event, { type: "event/LOADING_DIR", loaded });
  }

  // const initialNoteID = "20210108T145053.970Z.md";

  // if (NotesDB.exists(db, initialNoteID)) {
  // reply(event, { type: "event/LOADED_DIR", initialNoteID });
  // } else {
  reply(event, { type: "event/LOADED_DIR", initialNoteID: null });
  // }
};

const handleLoadNote = (
  event: Electron.IpcMainEvent,
  cmd: IpcLoadNoteCommand
) => {
  const { id } = cmd;
  const db = getDB();

  const note = NotesDB.getWithLinks(db, id);
  reply(event, { type: "event/SET_NOTE", note });
};

const handleDeleteNote = (
  event: Electron.IpcMainEvent,
  cmd: IpcDeleteNoteCommand
) => {
  const { id } = cmd;
  const db = getDB();

  const note = NotesDB.get(db, id);
  NotesDB.delete(db, id);
  NotesFS.delete(_path, id);

  note.linkIds.forEach((linkId) => {
    const note = NotesDB.getWithLinks(db, linkId);
    reply(event, { type: "event/SET_NOTE", note });
  });

  reply(event, { type: "event/DELETED_NOTE", id });
};

const handleAddNote = async (
  event: Electron.IpcMainEvent,
  cmd: IpcAddNoteCommand
) => {
  const { id, markdown } = cmd;
  const db = getDB();

  await NotesDB.save(db, id, markdown);

  NotesFS.save(_path, id, markdown);

  const note = NotesDB.getWithLinks(db, id);

  reply(event, { type: "event/SET_NOTE", note });
};

const handleSetNote = async (
  event: Electron.IpcMainEvent,
  cmd: IpcSetNoteCommand
) => {
  const { id, markdown } = cmd;
  const db = getDB();

  const noteBefore = NotesDB.get(db, id);

  await NotesDB.save(db, id, markdown);

  NotesFS.save(_path, id, markdown);

  const noteAfter = NotesDB.getWithLinks(db, id);

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

  linksAffected.forEach((link) => {
    const note = NotesDB.getWithLinks(db, link);
    reply(event, { type: "event/SET_NOTE", note });
  });
};

const handleSearch = async (
  event: Electron.IpcMainInvokeEvent,
  query: string
): Promise<NoteLink[]> => {
  const db = getDB();

  const ids = await NotesDB.search(db, query);
  const links = await NotesDB.getNoteLinks(db, ids);

  return links;
};

const handleWriteHTMLToClipboard = (
  event: Electron.IpcMainInvokeEvent,
  html: string
): void => {
  clipboard.writeHTML(html);
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

  ipcMain.handle('show-message-box', async (event, options) => {
    return await dialog.showMessageBox(options);
  });

  ipcMain.handle('write-html-to-clipboard', handleWriteHTMLToClipboard);
};
