import React from "react";
import { Note } from "../../interfaces/note";
import { NoteLinkContainer } from "../../containers/NoteLinkContainer";

type Props = {
  note: Note;
  onOpen: (id: string, push: boolean) => void;
};

export const Backlinks: React.FC<Props> = ({ note, onOpen }) => {
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
            <NoteLinkContainer id={link} onOpen={onOpen} />
          </span>
        ))}
      </div>
    </div>
  );
};
