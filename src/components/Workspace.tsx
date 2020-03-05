import React from "react";
import { NoteEditorContainer } from "../containers/NoteEditorContainer";
import { NoteListContainer } from "../containers/NoteListContainer";
import { Streams } from "../interfaces/streams";

type Props = {
  streams: Streams;
};

export const Workspace: React.FC<Props> = ({ streams }) => {
  return (
    <div className="flex flex-1 bg-gray-100">
      <div className="flex bg-white border-r-2 w-64">
        <NoteListContainer />
      </div>

      <div className="flex-1 flex flex-row p-2 overflow-y-scroll">
        {streams.map((stream, streamIdx) => (
          <div key={streamIdx} className="flex-1 border-4 border-red-500">
            {stream.map((noteId, noteIdx) => (
              <NoteEditorContainer
                key={[noteId, noteIdx].join("-")}
                id={noteId}
                location={[streamIdx, noteIdx]}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
