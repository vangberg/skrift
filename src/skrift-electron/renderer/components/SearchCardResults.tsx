import React from "react";
import { Note } from "../../../skrift/note";
import { NoteLinkContainer } from "../containers/NoteLinkContainer";
import { OpenCardMode } from "../interfaces/state";

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
              <NoteLinkContainer
                id={note.id}
                initialNote={note}
                onOpen={onOpen}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
