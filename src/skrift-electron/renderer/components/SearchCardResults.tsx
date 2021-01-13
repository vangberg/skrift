import React from "react";
import { Note } from "../../../skrift/note";
import { OpenCardMode } from "../interfaces/state";
import { NoteLink } from "./NoteLink";

type Props = {
  results: Note[];
  onOpen: (id: string, mode: OpenCardMode) => void;
};

export const SearchCardResults: React.FC<Props> = ({ results, onOpen }) => {
  return (
    <div className="overflow-y-auto">
      {results.length > 0 && (
        <ul className="list-disc list-outside ml-5 mt-2">
          {results.map((note) => (
            <li key={note.id} className="skrift-list-item">
              <NoteLink id={note.id} note={note} onOpen={onOpen} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
