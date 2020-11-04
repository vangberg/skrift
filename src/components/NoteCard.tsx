import React, { useCallback } from "react";
import { remote, clipboard } from "electron";

import { NoteCardBacklinks } from "./NoteCardBacklinks";
import { Note } from "../interfaces/note";
import { NoteEditorContainer } from "../containers/NoteEditorContainer";
import { StreamLocation } from "../interfaces/streams";
import { Card } from "./Card";
import { CardToolbar } from "./CardToolbar";
import { CardBody } from "./CardBody";
import { CardToolbarItem } from "./CardToolbarItem";

type Props = {
  location: StreamLocation;
  note: Note;
  onOpen: (id: string, push: boolean) => void;
  onDelete: () => void;
  onClose: () => void;
};

export const NoteCard: React.FC<Props> = ({
  location,
  note,
  onOpen,
  onDelete,
  onClose,
}) => {
  const handleDelete = useCallback(async () => {
    const { response } = await remote.dialog.showMessageBox({
      type: "question",
      message: `Are you sure you want to delete the note ${note.title}`,
      buttons: ["Yes", "No"],
    });
    if (response === 0) {
      onDelete();
    }
  }, [note.title, onDelete]);

  const handleCopy = useCallback(() => {
    clipboard.writeText(`[[${note.id}]]`);
  }, [note]);

  return (
    <Card location={location}>
      {(provided) => (
        <>
          <CardToolbar backgroundColor="bg-green-300">
            <CardToolbarItem onClick={handleDelete}>Delete</CardToolbarItem>
            <CardToolbarItem onClick={handleCopy}>Copy link</CardToolbarItem>
            <CardToolbarItem onClick={onClose}>Close</CardToolbarItem>
            <CardToolbarItem {...provided.dragHandleProps}>
              Move
            </CardToolbarItem>
          </CardToolbar>

          <CardBody>
            <NoteEditorContainer id={note.id} onOpen={onOpen} />

            <NoteCardBacklinks note={note} onOpen={onOpen} />
          </CardBody>
        </>
      )}
    </Card>
  );
};
