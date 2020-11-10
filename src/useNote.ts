import { NoteID, Note } from "./interfaces/note";
import { useEffect } from "react";
import { Ipc } from "./interfaces/ipc";
import { useCache } from "./useCache";

export const useNote = (id: NoteID): Note | null => {
  const [note, setNote] = useCache<Note | null>(`note/${id}`, null);

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
