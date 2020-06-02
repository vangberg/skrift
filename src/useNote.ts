import { NoteID, Note } from "./interfaces/note";
import { useEffect, useContext, useState, useCallback } from "react";
import { ipcRenderer } from "electron";
import { IpcLoadedNote, IpcLoadNote } from "./types";
import { StateContext } from "./state";

export const useNote = (id: NoteID): Note | null => {
  const [state] = useContext(StateContext);
  const [note, setNote] = useState<Note | null>(null);

  const handleLoadedNote = useCallback(
    (event, arg: IpcLoadedNote) => {
      const { note } = arg;
      setNote(note);
    },
    [setNote]
  );

  useEffect(() => {
    ipcRenderer.on(`loaded-note/${id}`, handleLoadedNote);

    const message: IpcLoadNote = { path: state.path, id };
    ipcRenderer.send("load-note", message);

    return () => {
      ipcRenderer.removeListener(`loaded-note/${id}`, handleLoadedNote);
    };
  }, [state.path, id, handleLoadedNote]);

  return note;
};
