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
    <div className="px-2 pb-2">
      <div className="border-b border-gray-400 text-gray-600 italic">
        Backlinks
      </div>
      <div className="pt-1">
        {[...note.backlinks].map((link) => (
          <span key={link} className="pr-1">
            <NoteLink id={link} onOpen={onOpen} getNote={getNote} />
          </span>
        ))}
      </div>
    </div>
  );
};
