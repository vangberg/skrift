import React, { useCallback, useEffect, useState } from "react";
import { reducer, StateContext, initialState } from "../state";
import { Workspace } from "../components/Workspace";
import useElmish, { Effects } from "react-use-elmish";
import { Ipc } from "../interfaces/ipc";
import {
  DragDropContext,
  DraggableLocation,
  OnDragEndResponder,
} from "react-beautiful-dnd";
import { StreamLocation } from "../interfaces/streams";
import { DroppableIds } from "../droppableIds";
import { NoteCacheContext, useNoteCache } from "../useNote";
import { UseCacheContext } from "../useCache";

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
export const WorkspaceContainer: React.FC = () => {
  const [state, dispatch] = useElmish(reducer, () => [
    initialState(),
    Effects.none(),
  ]);

  const cacheContext = useState(new Map());
  const noteCacheContext = useNoteCache();

  useEffect(() => {
    Ipc.send({ type: "command/LOAD_DIR" });
  }, [dispatch]);

  useEffect(() => dispatch({ type: "streams/OPEN_SEARCH", stream: 0 }), []);

  const handleDragEnd: OnDragEndResponder = useCallback(
    (result) => {
      if (result.destination) {
        const from = draggableLocationToStreamLoaction(result.source);
        const to = draggableLocationToStreamLoaction(result.destination);

        dispatch({ type: "streams/MOVE_NOTE", from, to });
      }
    },
    [dispatch]
  );

  return (
    <StateContext.Provider value={[state, dispatch]}>
      <UseCacheContext.Provider value={cacheContext}>
        <NoteCacheContext.Provider value={noteCacheContext}>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Workspace />
          </DragDropContext>
        </NoteCacheContext.Provider>
      </UseCacheContext.Provider>
    </StateContext.Provider>
  );
};
