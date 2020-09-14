import { NoteID, Note } from "./interfaces/note";
import { useEffect, useState, useCallback } from "react";
import { IpcSetNoteEvent } from "./types";
import clone from "fast-clone";
import { Ipc } from "./interfaces/ipc";
import produce from "immer";

export const useNote = (id: NoteID): Note | null => {
  const [note, setNote] = useState<Note | null>(null);

  const handleSetNote = useCallback((event: IpcSetNoteEvent) => {
    const { note } = event;
    const { slate } = note;

    /*
      When the same value is used by multiple instances of Slate,
      the last instance will always steal focus. We fix this at the
      "root" by cloning the value here, before passing it on to React/Slate.
      */
    setNote({ ...note, slate: clone(slate) });
  }, []);

  const handleAddBacklink = useCallback((id: NoteID) => {
    setNote((note) => {
      if (!note) {
        return null;
      }
      return produce(note, (draft) => {
        draft.backlinks.add(id);
      });
    });
  }, []);

  const handleDeleteBacklink = useCallback((id: NoteID) => {
    setNote((note) => {
      if (!note) {
        return null;
      }
      return produce(note, (draft) => {
        draft.backlinks.delete(id);
      });
    });
  }, []);

  useEffect(() => {
    const deregister = Ipc.on((event) => {
      switch (event.type) {
        case "event/SET_NOTE":
          if (event.note.id === id) {
            handleSetNote(event);
          }
          break;
        case "event/ADDED_LINK":
          if (event.to === id) {
            handleAddBacklink(event.from);
          }
          break;
        case "event/DELETED_LINK":
          if (event.to === id) {
            handleDeleteBacklink(event.from);
          }
          break;
      }
    });

    Ipc.send({ type: "command/LOAD_NOTE", id });

    return deregister;
  }, [id, handleSetNote, handleAddBacklink, handleDeleteBacklink]);

  return note;
};
