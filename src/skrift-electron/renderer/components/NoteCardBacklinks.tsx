import React from "react";
import { NoteWithLinks } from "../../../skrift/note/index.js";
import { OpenCardMode } from "../interfaces/state/index.js";
import { NoteLink } from "./NoteLink.js";

type Props = {
  note: NoteWithLinks;
  onOpen: (id: string, mode: OpenCardMode) => void;
};

export const NoteCardBacklinks: React.FC<Props> = ({ note, onOpen }) => {
  if (note.backlinks.length === 0) {
    return null;
  }

  return (
    <details className="px-2 py-1 bg-gray-100">
      <summary className="cursor-pointer select-none">
        Backlinks ({note.backlinks.length})
      </summary>
      <div>
        <ul className="list-disc list-outside ml-5">
          {note.backlinks.map((link) => (
            <li key={link.id}>
              <NoteLink link={link} onOpen={onOpen} />
            </li>
          ))}
        </ul>
      </div>
    </details>
  );
};
