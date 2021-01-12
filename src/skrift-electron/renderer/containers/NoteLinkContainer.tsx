import React from "react";
import { Note, NoteID } from "../../../skrift/note";
import { NoteLink } from "../components/NoteLink";
import { useNote } from "../hooks/useNote";
import { OpenCardMode } from "../interfaces/state";

interface Props {
  id: NoteID;
  initialNote?: Note;
  onOpen: (id: string, mode: OpenCardMode) => void;
}

export const NoteLinkContainer: React.FC<Props> = ({
  id,
  initialNote,
  onOpen,
}) => {
  const note = useNote(id);

  return (
    <NoteLink id={id} note={note || initialNote || null} onOpen={onOpen} />
  );
};
