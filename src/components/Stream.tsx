import React from "react";
import { NoteEditorContainer } from "../containers/NoteEditorContainer";
import { Stream as StreamType, StreamIndex } from "../interfaces/streams";

type Props = {
  index: StreamIndex;
  stream: StreamType;
};

export const Stream: React.FC<Props> = ({ index, stream }) => {
  return (
    <div className="flex-1 overflow-y-auto max-w-2xl">
      {stream.map((noteId, noteIdx) => (
        <NoteEditorContainer
          key={[noteId, noteIdx].join("-")}
          id={noteId}
          location={[index, noteIdx]}
        />
      ))}
    </div>
  );
};
