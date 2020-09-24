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
    const deregister = Ipc.on((reply) => {
      switch (reply.type) {
        case "event/LOADED_DIR":
          dispatch({ type: "notes/SET_NOTES", notes: reply.notes });
          break;
        case "event/SET_NOTE":
          dispatch({ type: "notes/SET_NOTE", note: reply.note });
          break;
        case "event/DELETED_NOTE":
          dispatch({ type: "notes/DELETE_NOTE", id: reply.id });
          break;
        case "event/SEARCH":
          dispatch({ type: "search/SET_RESULTS", results: reply.ids });
      }
    });

    Ipc.send({ type: "command/LOAD_DIR" });

    return deregister;
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
