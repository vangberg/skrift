import { ipcMain } from "electron";
import { NotesFS } from "../interfaces/notes_fs";
import { IpcLoadNote, IpcSetNote, IpcLoadedNote } from "../types";

const handleLoadNote = async (
  event: Electron.IpcMainEvent,
  arg: IpcLoadNote
) => {
  const { path, id } = arg;

  const note = await NotesFS.read(path, id);
  const message: IpcLoadedNote = { note };
  event.reply("loaded-note", message);
};

const handleSetNote = async (event: Electron.IpcMainEvent, arg: IpcSetNote) => {
  const { path, id, markdown } = arg;

  await NotesFS.save(path, id, markdown);
  const note = await NotesFS.read(path, id);
  const message: IpcLoadedNote = { note };
  event.reply("loaded-note", message);
};

export const setupIpc = () => {
  ipcMain.on("load-note", handleLoadNote);
  ipcMain.on("set-note", handleSetNote);
};
