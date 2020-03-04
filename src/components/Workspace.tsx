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
      <div className="flex bg-white border-r-2 w-64">
        <NoteListContainer />
      </div>

      <div className="flex-1 p-2 overflow-y-scroll">
        {[...openIds].map((id, idx) => (
          <NoteEditorContainer key={[id, idx].join("-")} id={id} index={idx} />
        ))}
      </div>
    </div>
  );
};
