import { NoteID, Note } from "./interfaces/note";
import { useEffect, useContext, useState, useCallback } from "react";
import { ipcRenderer } from "electron";
import { IpcLoadedNote, IpcLoadNote } from "./types";
import clone from "fast-clone";

export const useNote = (id: NoteID): Note | null => {
  const [note, setNote] = useState<Note | null>(null);

  const handleLoadedNote = useCallback(
    (event, arg: IpcLoadedNote) => {
      const { note } = arg;
      const { slate } = note;

      /*
      When the same value is used by multiple instances of Slate,
      the last instance will always steal focus. We fix this at the
      "root" by cloning the value here, before passing it on to React/Slate.
      */
      setNote({ ...note, slate: clone(slate) });
    },
    [setNote]
  );

  useEffect(() => {
    ipcRenderer.on(`loaded-note/${id}`, handleLoadedNote);

    const message: IpcLoadNote = { id };
    ipcRenderer.send("load-note", message);

    return () => {
      ipcRenderer.removeListener(`loaded-note/${id}`, handleLoadedNote);
    };
  }, [id, handleLoadedNote]);

  return note;
};
