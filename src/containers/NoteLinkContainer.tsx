import React from "react";
import { NoteID } from "../interfaces/note";
import { NoteLink } from "../components/NoteLink";
import { useNote } from "../useNote";

interface Props {
  id: NoteID;
  onOpen: (id: string, push: boolean) => void;
}

export const NoteLinkContainer: React.FC<Props> = ({ id, onOpen }) => {
  const note = useNote(id);

  return <NoteLink id={id} note={note} onOpen={onOpen} />;
};
