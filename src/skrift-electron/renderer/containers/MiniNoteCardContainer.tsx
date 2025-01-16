import React from "react";
import { NoteID } from "../../../skrift/note/index.js";
import { MiniNoteCard } from "../components/MiniNoteCard.js";
import { useNote } from "../hooks/useNote.js";

interface Props {
  id: NoteID;
}

export const MiniNoteCardContainer: React.FC<Props> = ({ id }) => {
  const note = useNote(id);

  if (!note) {
    return null;
  }

  return <MiniNoteCard note={note} />;
};
