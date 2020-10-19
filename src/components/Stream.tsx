import React, { useMemo } from "react";
import { Droppable } from "react-beautiful-dnd";
import { StreamNoteContainer } from "../containers/StreamNoteContainer";
import { DroppableIds } from "../droppableIds";
import { Stream as StreamType, StreamIndex } from "../interfaces/streams";

type Props = {
  index: StreamIndex;
  stream: StreamType;
};

export const Stream: React.FC<Props> = ({ index, stream }) => {
  const entries = stream.entries.map((entry, noteIdx) => (
    <StreamNoteContainer
      key={entry.key}
      id={entry.noteId}
      location={[index, noteIdx]}
    />
  ));

  const droppableId = useMemo(
    () => DroppableIds.serialize({ type: "stream", index }),
    [index]
  );

  return (
    <Droppable droppableId={droppableId}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className="flex-1 skrift-flex-empty-0 overflow-y-auto min-w-sm max-w-2xl py-2"
        >
          {entries}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};
