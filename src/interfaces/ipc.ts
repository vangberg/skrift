import { IpcEvent, IpcCommand } from "../types";
import { ipcRenderer } from "electron";

export const Ipc = {
  on(callback: (event: IpcEvent) => void) {
    // Create a memoized callback so we have a unique function to
    // de-register from the event listener.
    const _callback = (event: IpcEvent) => callback(event);

    ipcRenderer.on("skrift", (_, arg: IpcEvent) => _callback(arg));

    return () => {
      ipcRenderer.removeListener("skrift", _callback);
    };
  },

  send(command: IpcCommand) {
    ipcRenderer.send("skrift", command);
  },
};
