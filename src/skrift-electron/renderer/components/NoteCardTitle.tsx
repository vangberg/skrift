import React from "react";
import { Note } from "../../../skrift/note";

interface Props {
  note: Note;
}

export const NoteCardTitle: React.FC<Props> = ({ note }) => {
  return (
    <div className="p-2 markdown">
      <h1>{note.title}</h1>
    </div>
  );
};
