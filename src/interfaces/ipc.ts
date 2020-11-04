import { IpcReply, IpcCommand } from "../types";
import { IpcRenderer, ipcRenderer, IpcRendererEvent } from "electron";
import { Note, NoteID } from "./note";

export const Ipc = {
  on(callback: (reply: IpcReply) => void) {
    // Create a memoized callback so we have a unique function to
    // de-register from the event listener.
    const _callback = (event: IpcRendererEvent, reply: IpcReply) =>
      callback(reply);

    ipcRenderer.on("skrift", _callback);

    return () => {
      ipcRenderer.removeListener("skrift", _callback);
    };
  },

  send(command: IpcCommand) {
    ipcRenderer.send("skrift", command);
  },

  search(query: String): Promise<Note[]> {
    return ipcRenderer.invoke("search", query);
  },
};
