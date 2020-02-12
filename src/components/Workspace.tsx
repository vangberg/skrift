import React, { useContext, useCallback } from "react";
import { StateContext } from "../state";
import { NoteEditorContainer } from "../containers/NoteEditorContainer";
import { NoteListContainer } from "../containers/NoteListContainer";
import { FileList } from "./FileList";

export const Workspace: React.FC = () => {
  const [state] = useContext(StateContext);
  const { openIds } = state;

  return (
    <div className="flex flex-1 bg-gray-100">
      <div className="p-2 max-w-xs bg-white border-r-2">
        <div className="border border-green-500">
          <FileList />
        </div>
        <NoteListContainer />
      </div>

      <div className="flex-grow p-2 overflow-y-scroll">
        {[...openIds].map(id => (
          <NoteEditorContainer key={id} id={id} />
        ))}
      </div>
    </div>
  );
};
