import React, { useCallback, useEffect } from "react";
import { Streams } from "../components/Streams";
import {
  DragDropContext,
  DraggableLocation,
  OnDragEndResponder,
} from "react-beautiful-dnd";
import { StreamsContext, useStreams } from "../useStreams";
import { StreamLocation } from "../interfaces/streams";
import { DroppableIds } from "../droppableIds";

const draggableLocationToStreamLoaction = (
  draggableLocation: DraggableLocation
): StreamLocation => {
  const droppableId = DroppableIds.deserialize(draggableLocation.droppableId);

  switch (droppableId.type) {
    case "stream":
      return [droppableId.index, draggableLocation.index];
    default:
      throw new Error(`Unknown droppableId type: ${droppableId.type}`);
  }
};

export const StreamsContainer: React.FC = () => {
  const [streams, actions] = useStreams();
  const { moveNote, openSearch } = actions;

  useEffect(() => openSearch(0), []);

  const handleDragEnd: OnDragEndResponder = useCallback(
    (result) => {
      if (result.destination) {
        const from = draggableLocationToStreamLoaction(result.source);
        const to = draggableLocationToStreamLoaction(result.destination);
        moveNote(from, to);
      }
    },
    [moveNote]
  );

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <StreamsContext.Provider value={[streams, actions]}>
        <Streams streams={streams} />
      </StreamsContext.Provider>
    </DragDropContext>
  );
};
