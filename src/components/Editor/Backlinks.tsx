import React from "react";
import { Note } from "../../interfaces/note";
import { NoteLink } from "./NoteLink";

type Props = {
  note: Note;
  onOpen: (id: string) => void;
  getNote: (id: string) => Note | undefined;
};

export const Backlinks: React.FC<Props> = ({ note, onOpen, getNote }) => {
  return (
    <div>
      <h2>Backlinks</h2>
      {[...note.backlinks].map(link => (
        <NoteLink key={link} id={link} onOpen={onOpen} getNote={getNote} />
      ))}
    </div>
  );
};
