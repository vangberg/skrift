import React from "react";
import { NoteEditorContainer } from "../containers/NoteEditorContainer";
import { Stream as StreamType, StreamIndex } from "../interfaces/streams";

type Props = {
  index: StreamIndex;
  stream: StreamType;
};

export const Stream: React.FC<Props> = ({ index, stream }) => {
  const entries = stream.map((entry, noteIdx) => (
    <NoteEditorContainer
      key={entry.key}
      id={entry.noteId}
      location={[index, noteIdx]}
    />
  ));

  return (
    <div className="flex-1 skrift-flex-empty-0 overflow-y-auto max-w-2xl">
      {entries}
    </div>
  );
};
