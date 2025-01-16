import { ipcRenderer, IpcRendererEvent } from "electron";
import { IpcReply, IpcCommand } from "../shared/types.js";
import { Note } from "../../skrift/note/index.js";

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

  showMessageBox(options: Electron.MessageBoxOptions): Promise<Electron.MessageBoxReturnValue> {
    return ipcRenderer.invoke('show-message-box', options);
  },

  writeHTMLToClipboard(html: string): Promise<void> {
    return ipcRenderer.invoke('write-html-to-clipboard', html);
  },
};
