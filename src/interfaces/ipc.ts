import { IpcReply, IpcCommand } from "../types";
import { ipcRenderer } from "electron";

export const Ipc = {
  on(callback: (reply: IpcReply) => void) {
    // Create a memoized callback so we have a unique function to
    // de-register from the event listener.
    const _callback = (reply: IpcReply) => callback(reply);

    ipcRenderer.on("skrift", (_, reply: IpcReply) => _callback(reply));

    return () => {
      ipcRenderer.removeListener("skrift", _callback);
    };
  },

  send(command: IpcCommand) {
    ipcRenderer.send("skrift", command);
  },
};
