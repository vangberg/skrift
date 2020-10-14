import React from "react";
import { NoteListContainer } from "../containers/NoteListContainer";
import { StreamsContainer } from "../containers/StreamsContainer";

export const Workspace: React.FC = () => {
  return (
    <div className="h-screen flex-1 flex bg-gray-200 text-sm">
      <div className="flex bg-white w-80">
        <NoteListContainer />
      </div>

      <div className="flex-1 flex flex-row justify-center px-1">
        <StreamsContainer />
      </div>
    </div>
  );
};
