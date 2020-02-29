import React from "react";
import { NoteEditorContainer } from "../containers/NoteEditorContainer";
import { NoteListContainer } from "../containers/NoteListContainer";
import { NoteID } from "../interfaces/note";

type Props = {
  openIds: NoteID[];
};

export const Workspace: React.FC<Props> = ({ openIds }) => {
  return (
    <div className="flex flex-1 bg-gray-100">
      <div className="p-2 max-w-xs bg-white border-r-2">
        <NoteListContainer />
      </div>

      <div className="flex-grow p-2 overflow-y-scroll">
        {[...openIds].map((id, idx) => (
          <NoteEditorContainer key={[id, idx].join("-")} id={id} index={idx} />
        ))}
      </div>
    </div>
  );
};
