import React, { useCallback, useState } from "react";

import { Ipc } from "../ipc.js";
import { NoteCardBacklinks } from "./NoteCardBacklinks.js";
import { NoteWithLinks } from "../../../skrift/note/index.js";
import { NoteEditorContainer } from "../containers/NoteEditorContainer.js";
import { Card } from "./Card.js";
import { CardToolbar } from "./CardToolbar.js";
import { CardBody } from "./CardBody.js";
import { CardToolbarItem } from "./CardToolbarItem.js";
import { NoteCard as NoteCardType, OpenCardMode } from "../interfaces/state/index.js";
import { NoteCardTitle } from "./NoteCardTitle.js";
import { CardTitle } from "./CardTitle.js";

type Props = {
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
    const { response } = await Ipc.showMessageBox({
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
    Ipc.writeHTMLToClipboard(`<a data-pm-slice="0 0 []" href="${note.id}">${note.title}</a>`);
  }, [note]);

  return (
    <Card>
      <CardToolbar>
        <CardToolbarItem onClick={handleDelete}>Delete</CardToolbarItem>
        <CardToolbarItem onClick={handleCopy}>Copy link</CardToolbarItem>
        <CardToolbarItem onClick={onClose}>Close</CardToolbarItem>
      </CardToolbar>

      <CardTitle visible={collapsed}>
        <NoteCardTitle note={note} />
      </CardTitle>

      <CardBody visible={!collapsed}>
        <NoteEditorContainer id={note.id} focus={focus} onOpen={onOpen} />
      </CardBody>
    </Card>
  );
};
