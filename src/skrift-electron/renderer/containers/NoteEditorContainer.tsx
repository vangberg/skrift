import "prosemirror-view/style/prosemirror.css";

import React, { useCallback } from "react";
import { useNote } from "../hooks/useNote.js";
import { NoteID } from "../../../skrift/note/index.js";
import { OpenCardMode } from "../interfaces/state/index.js";
import { NoteEditor } from "../components/NoteEditor/index.js";
import { Ipc } from "../ipc.js";

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
