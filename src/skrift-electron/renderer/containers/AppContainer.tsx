import React, { useCallback, useEffect, useMemo, useState } from "react";
import { DevInfo } from "../components/DevInfo";
import { Splash } from "../components/Splash";
import { useImmer } from "use-immer";
import { CacheContext } from "../hooks/useCache";
import { Ipc } from "../ipc";
import { createStateActions, State, StateContext } from "../interfaces/state";
import { DragDropContext, OnDragEndResponder } from "react-beautiful-dnd";
import { DroppableIds } from "../interfaces/droppableIds";
import { WorkspaceCardContainer } from "./WorkspaceCardContainer";
import { DraggableIds } from "../interfaces/draggableIds";

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

          if (event.initialNoteID) {
            actions.openCard([0], "below", {
              type: "note",
              id: event.initialNoteID,
            });
          } else {
            actions.openCard([0], "below", {
              type: "search",
              query: "*",
            });
          }
          break;
        case "event/LOADING_DIR":
          setLoaded(event.loaded);
          break;
      }
    });

    return deregister;
  }, [actions]);

  const handleDragEnd: OnDragEndResponder = useCallback(
    (result) => {
      const from = [
        ...DroppableIds.deserialize(result.source.droppableId),
        result.source.index,
      ];

      if (result.combine) {
        actions.combine(
          from,
          DraggableIds.deserialize(result.combine.draggableId)
        );

        return;
      }

      if (result.destination) {
        const to = [
          ...DroppableIds.deserialize(result.destination.droppableId),
          result.destination.index,
        ];
        actions.move(from, to);
      }
    },
    [actions]
  );

  return (
    <CacheContext.Provider value={cacheContext}>
      <StateContext.Provider value={[state, actions]}>
        {loading ? (
          <Splash loaded={loaded} />
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <WorkspaceCardContainer path={[]} card={state.workspace} />
          </DragDropContext>
        )}
        <DevInfo />
      </StateContext.Provider>
    </CacheContext.Provider>
  );
};
