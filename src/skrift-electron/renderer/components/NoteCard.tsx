import React, { useCallback, useState } from "react";
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
import { NoteCardTitle } from "./NoteCardTitle";
import { CardTitle } from "./CardTitle";

type Props = {
  path: Path;
  card: NoteCardType;
  note: NoteWithLinks;
  focus: number;
  onOpen: (id: string, mode: OpenCardMode) => void;
  onDelete: () => void;
  onClose: () => void;
  onToggle: () => void;
  onFocus: () => void;
};

export const NoteCard: React.FC<Props> = ({
  path,
  card,
  note,
  focus,
  onOpen,
  onDelete,
  onClose,
  onToggle,
  onFocus,
}) => {
  const { collapsed } = card.meta;
  const handleFocus = useCallback(() => onFocus(), [onFocus]);

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
          <CardToolbar>
            <CardToolbarItem onClick={handleDelete}>Delete</CardToolbarItem>
            <CardToolbarItem onClick={handleCopy}>Copy link</CardToolbarItem>
            <CardToolbarItem onClick={onClose}>Close</CardToolbarItem>
            <CardToolbarItem {...provided.dragHandleProps}>
              Move
            </CardToolbarItem>
          </CardToolbar>

          <CardTitle visible={collapsed}>
            <NoteCardTitle note={note} />
          </CardTitle>

          <CardBody visible={!collapsed}>
            <NoteEditorContainer id={note.id} focus={focus} onOpen={onOpen} />
            <NoteCardBacklinks note={note} onOpen={onOpen} />
          </CardBody>
        </>
      )}
    </Card>
  );
};
