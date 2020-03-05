import React from "react";
import { NoteListContainer } from "../containers/NoteListContainer";
import { StreamsContainer } from "../containers/StreamsContainer";

export const Workspace: React.FC = () => {
  return (
    <div className="h-screen w-full flex bg-gray-100">
      <div className="flex bg-white border-r-2 w-64">
        <NoteListContainer />
      </div>

      <div className="flex-1 flex flex-row py-2 pr-2 overflow-y-scroll overflow-x-scroll">
        <StreamsContainer />
      </div>
    </div>
  );
};
