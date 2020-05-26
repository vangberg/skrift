import { ipcMain } from "electron";
import { IpcLoadNote, IpcLoadedNote } from "../types";
import { NotesFS } from "../interfaces/notes_fs";

export const setupIpc = () => {
  ipcMain.on("load-note", (event, arg: IpcLoadNote) => {
    const { path, id } = arg;

    NotesFS.read(path, id).then((note) => {
      const reply: IpcLoadedNote = {
        note,
      };

      event.reply("loaded-note", reply);
    });
  });
};
