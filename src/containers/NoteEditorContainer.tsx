import React, { useCallback } from "react";
import { Editor } from "../components/Editor";
import { NoteID } from "../interfaces/note";
import { Node } from "slate";
import { useNote } from "../useNote";
import { Ipc } from "../interfaces/ipc";

interface Props {
  id: NoteID;
  onOpen: (id: string, push: boolean) => void;
}

export const NoteEditorContainer: React.FC<Props> = ({ id, onOpen }) => {
  const note = useNote(id);

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
