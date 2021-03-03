import React, { useCallback } from "react";
import { remote, clipboard } from "electron";

import { NoteCardBacklinks } from "./NoteCardBacklinks";
import { NoteWithLinks } from "../../../skrift/note";
import { NoteEditorContainer } from "../containers/NoteEditorContainer";
import { Card } from "./Card";
import { CardToolbar } from "./CardToolbar";
import { CardBody } from "./CardBody";
import { CardToolbarItem } from "./CardToolbarItem";
import { Path } from "../interfaces/path";
import { NoteCard as NoteCardType, OpenCardMode } from "../interfaces/state";

type Props = {
  path: Path;
  card: NoteCardType;
  note: NoteWithLinks;
  onOpen: (id: string, mode: OpenCardMode) => void;
  onDelete: () => void;
  onClose: () => void;
};

export const NoteCard: React.FC<Props> = ({
  path,
  card,
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
    // For some reason it works when we add data-pm-slice. If interested in
    // debugging, look into clipboard.js in prosemirror-view.
    clipboard.writeHTML(`<a data-pm-slice="0 0 []" href="${note.id}">#</a>`);
  }, [note]);

  return (
    <Card card={card} path={path}>
      {(provided) => (
        <>
          <CardToolbar backgroundColor="bg-green-400">
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
