import React from "react";
import { NoteListContainer } from "../containers/NoteListContainer";
import { StreamsContainer } from "../containers/StreamsContainer";

export const Workspace: React.FC = () => {
  return (
    <div className="h-screen w-full flex bg-gray-200 text-sm">
      <div className="flex bg-white w-1/4 min-w-xs">
        <NoteListContainer />
      </div>

      <div className="flex-1 flex flex-row justify-center py-2 px-1">
        <StreamsContainer />
      </div>
    </div>
  );
};
