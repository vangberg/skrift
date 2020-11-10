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
import { CacheContext } from "../useCache";
import { DevInfo } from "../components/DevInfo";
import { Splash } from "../components/Splash";
import { useImmer } from "use-immer";

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

  const cacheContext = useImmer(new Map());

  const [loading, setLoading] = useState(true);
  const [loaded, setLoaded] = useState(0);

  useEffect(() => {
    Ipc.send({ type: "command/LOAD_DIR" });

    const deregister = Ipc.on((event) => {
      switch (event.type) {
        case "event/LOADED_DIR":
          setLoading(false);
          break;
        case "event/LOADING_DIR":
          setLoaded(event.loaded);
          break;
      }
    });

    return deregister;
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
      <CacheContext.Provider value={cacheContext}>
        <DragDropContext onDragEnd={handleDragEnd}>
          <DevInfo />
          {loading ? <Splash loaded={loaded} /> : <Workspace />}
        </DragDropContext>
      </CacheContext.Provider>
    </StateContext.Provider>
  );
};
