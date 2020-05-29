import React from "react";
import { NoteID } from "../interfaces/note";
import { ListItem } from "../components/NoteList/ListItem";
import { useNote } from "../noteCache";

interface Props {
  id: NoteID;
  onClick?: (id: NoteID, push: boolean) => void;
}

export const NoteListItemContainer: React.FC<Props> = ({ id, onClick }) => {
  const note = useNote(id);

  if (!note) {
    return <div>Loading</div>;
  }

  return <ListItem note={note} onClick={onClick} />;
};
