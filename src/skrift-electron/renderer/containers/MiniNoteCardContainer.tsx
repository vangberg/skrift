import React from "react";
import { NoteID } from "../../../skrift/note";
import { MiniNoteCard } from "../components/MiniNoteCard";
import { useNote } from "../hooks/useNote";

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
