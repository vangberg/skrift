import React, { useCallback, useEffect } from "react";
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

  const noteCacheContext = useNoteCache();

  useEffect(() => {
    Ipc.send({ type: "command/LOAD_DIR" });
    return Ipc.on((event) => {
      if (event.type === "event/LOADED_DIR") {
        event.notes
          .slice(0, 5)
          .forEach((note) =>
            dispatch({ type: "streams/OPEN_NOTE", stream: 0, id: note.id })
          );
      }
    });
  }, [dispatch]);

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
      <NoteCacheContext.Provider value={noteCacheContext}>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Workspace />
        </DragDropContext>
      </NoteCacheContext.Provider>
    </StateContext.Provider>
  );
};
