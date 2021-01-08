import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Workspace } from "../components/Workspace";
import { DevInfo } from "../components/DevInfo";
import { Splash } from "../components/Splash";
import { useImmer } from "use-immer";
import { CacheContext } from "../hooks/useCache";
import { Ipc } from "../ipc";
import { createStateActions, State, StateContext } from "../interfaces/state";
import {
  DragDropContext,
  DraggableLocation,
  OnDragEndResponder,
} from "react-beautiful-dnd";
import { DroppableIds } from "../interfaces/droppableIds";

export const AppContainer: React.FC = () => {
  const cacheContext = useImmer(new Map());

  const [loading, setLoading] = useState(true);
  const [loaded, setLoaded] = useState(0);

  const [state, setState] = useImmer(() => State.initial());
  const actions = useMemo(() => createStateActions(setState), [setState]);

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
  }, []);

  const handleDragEnd: OnDragEndResponder = useCallback(
    (result) => {
      if (!result.destination) {
        return;
      }

      const from = [
        ...DroppableIds.deserialize(result.source.droppableId),
        result.source.index,
      ];
      const to = [
        ...DroppableIds.deserialize(result.destination.droppableId),
        result.destination.index,
      ];

      actions.move(from, to);
    },
    [actions]
  );

  return (
    <CacheContext.Provider value={cacheContext}>
      <StateContext.Provider value={[state, actions]}>
        <DevInfo />
        {loading ? (
          <Splash loaded={loaded} />
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Workspace path={[]} card={state.workspace} />
          </DragDropContext>
        )}
      </StateContext.Provider>
    </CacheContext.Provider>
  );
};
