import React, { useContext } from "react";
import { NoteID } from "../interfaces/note";
import { NoteLink } from "../components/Editor/NoteLink";
import { StateContext } from "../state";

interface Props {
  id: NoteID;
  onOpen: (id: string, push: boolean) => void;
}

export const NoteLinkContainer: React.FC<Props> = ({ id, onOpen }) => {
  const [state] = useContext(StateContext);
  const note = state.notes.get(id) || null;

  return <NoteLink id={id} note={note} onOpen={onOpen} />;
};
