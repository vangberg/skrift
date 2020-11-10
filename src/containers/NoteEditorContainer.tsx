import React, { useCallback, useEffect, useState } from "react";
import { Node } from "slate";
import clone from "fast-clone";
import { Editor } from "../components/Editor";
import { Note, NoteID } from "../interfaces/note";
import { useNote } from "../useNote";
import { Ipc } from "../interfaces/ipc";

interface Props {
  id: NoteID;
  onOpen: (id: string, push: boolean) => void;
}

export const NoteEditorContainer: React.FC<Props> = ({ id, onOpen }) => {
  const cachedNote = useNote(id);

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

  const handleUpdate = useCallback(
    (slate: Node[]) => {
      Ipc.send({ type: "command/SET_NOTE", id, slate });
    },
    [id]
  );

  if (!note) {
    return null;
  }

  return <Editor note={note} onOpen={onOpen} onUpdate={handleUpdate} />;
};
