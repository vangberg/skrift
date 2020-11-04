import { NoteID, Note } from "./interfaces/note";
import { useEffect, useState } from "react";
import clone from "fast-clone";
import { Ipc } from "./interfaces/ipc";
import { useCache } from "./useCache";

export const useNote = (id: NoteID): Note | null => {
  const [cachedNote, setCachedNote] = useCache<Note | null>(`note/${id}`, null);

  /*
  When the same value is used by multiple instances of Slate,
  the last instance will always steal focus. We fix this at the
  "root" by cloning the value here, before passing it on to React/Slate.
  */
  const [note, setNote] = useState<Note | null>(null);

  useEffect(() => {
    if (cachedNote) {
      setNote({ ...cachedNote, slate: clone(cachedNote.slate) });
    }
  }, [cachedNote]);

  useEffect(() => {
    Ipc.send({ type: "command/LOAD_NOTE", id });

    const deregister = Ipc.on((event) => {
      if (event.type === "event/SET_NOTE" && event.note.id === id) {
        setCachedNote(event.note);
      }
    });

    return deregister;
  }, [id, setCachedNote]);

  return note;
};
