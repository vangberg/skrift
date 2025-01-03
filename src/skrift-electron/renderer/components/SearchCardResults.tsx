import React from "react";
import { NoteLink as NoteLinkType } from "../../../skrift/note";
import { OpenCardMode } from "../interfaces/state";
import { NoteLink } from "./NoteLink";

type Props = {
  results: NoteLinkType[];
  onOpen: (id: string, mode: OpenCardMode) => void;
};

export const SearchCardResults: React.FC<Props> = ({ results, onOpen }) => {
  return (
    <div className="overflow-y-auto">
      {results.length > 0 && (
        <ul className="list-disc list-outside ml-5 mt-2">
          {results.map((link) => (
            <li key={link.id} className="skrift-list-item">
              <NoteLink link={link} onOpen={onOpen} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
