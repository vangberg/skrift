import { ipcMain } from "electron";
import { NotesFS } from "../interfaces/notes_fs";
import { IpcLoadNote } from "../types";
import { Note } from "../interfaces/note";

const handleLoadNote = async (
  event: Electron.IpcMainInvokeEvent,
  arg: IpcLoadNote
): Promise<Note> => {
  const { path, id } = arg;

  const note = await NotesFS.read(path, id);

  return note;
};

export const setupIpc = () => {
  ipcMain.handle("load-note", handleLoadNote);
};
