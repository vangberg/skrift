import React from "react";
import { Note } from "../../../skrift/note";
import { NoteLinkContainer } from "../containers/NoteLinkContainer";
import { OpenCardMode } from "../interfaces/state";

type Props = {
  note: Note;
  onOpen: (id: string, mode: OpenCardMode) => void;
};

export const NoteCardBacklinks: React.FC<Props> = ({ note, onOpen }) => {
  if (note.backlinkIds.size === 0) {
    return null;
  }

  return (
    <details className="p-2 bg-gray-100">
      <summary className="cursor-pointer">
        Backlinks ({note.backlinkIds.size})
      </summary>
      <div>
        <ul className="list-disc list-outside ml-5">
          {[...note.backlinkIds].map((link) => (
            <li key={link}>
              <NoteLinkContainer id={link} onOpen={onOpen} />
            </li>
          ))}
        </ul>
      </div>
    </details>
  );
};
