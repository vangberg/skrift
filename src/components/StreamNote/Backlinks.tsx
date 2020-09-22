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
        <ul className="list-disc list-outside ml-5">
          {[...note.backlinks].map((link) => (
            <li key={link}>
              <NoteLinkContainer id={link} onOpen={onOpen} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
