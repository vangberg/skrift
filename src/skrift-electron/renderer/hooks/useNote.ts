import { useEffect } from "react";
import { NoteID, Note, NoteWithLinks } from "../../../skrift/note/index.js";
import { Ipc } from "../ipc.js";
import { useCache } from "./useCache.js";

export const useNote = (id: NoteID): NoteWithLinks | null => {
  const [note, setNote] = useCache<NoteWithLinks | null>(`note/${id}`, null);

  useEffect(() => {
    Ipc.send({ type: "command/LOAD_NOTE", id });

    const deregister = Ipc.on((event) => {
      if (event.type === "event/SET_NOTE" && event.note.id === id) {
        setNote(event.note);
      }
    });

    return deregister;
  }, [id, setNote]);

  return note;
};
