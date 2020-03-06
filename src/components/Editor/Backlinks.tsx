import React from "react";
import { Note } from "../../interfaces/note";
import { NoteLink } from "./NoteLink";

type Props = {
  note: Note;
  onOpen: (id: string, push: boolean) => void;
  getNote: (id: string) => Note | undefined;
};

export const Backlinks: React.FC<Props> = ({ note, onOpen, getNote }) => {
  if (note.backlinks.size === 0) {
    return null;
  }

  return (
    <div className="p-2">
      <span className="bg-gray-600 rounded-lg p-1 text-white mr-1">
        Backlinks
      </span>
      {[...note.backlinks].map(link => (
        <NoteLink key={link} id={link} onOpen={onOpen} getNote={getNote} />
      ))}
    </div>
  );
};
