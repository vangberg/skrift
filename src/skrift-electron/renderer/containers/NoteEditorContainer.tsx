import "prosemirror-view/style/prosemirror.css";

import React, { useCallback } from "react";
import { useNote } from "../hooks/useNote";
import { NoteID } from "../../../skrift/note";
import { OpenCardMode } from "../interfaces/state";
import { NoteEditor } from "../components/NoteEditor";
import { Ipc } from "../ipc";

interface Props {
  id: NoteID;
  focus: number;
  onOpen: (id: string, mode: OpenCardMode) => void;
}

export const NoteEditorContainer: React.FC<Props> = ({ id, focus, onOpen }) => {
  const note = useNote(id);

  const handleUpdate = useCallback(
    (markdown: string) => {
      Ipc.send({ type: "command/SET_NOTE", id, markdown });
    },
    [id]
  );

  if (!note) {
    return null;
  }

  return (
    <NoteEditor
      note={note}
      focus={focus}
      onOpen={onOpen}
      onUpdate={handleUpdate}
    />
  );
};
