import React, { useCallback, useEffect, useMemo, useState } from "react";
import { DevInfo } from "../components/DevInfo";
import { Splash } from "../components/Splash";
import { useImmer } from "use-immer";
import { CacheContext } from "../hooks/useCache";
import { Ipc } from "../ipc";
import {
  createStateActions,
  State,
  StateContext,
  Stream,
} from "../interfaces/state";
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
        // We don't get the index in `combine`, so we need to find
        // the stream (which we can get from `droppableId`), and then
        // find the card in that stream with the matching `key` from
        // `draggableId`.

        // This should somehow be moved to `State`, but at the other
        // hand, react-beautiful-dnd should really include the index
        // in `result.combine`.

        const droppableId = DroppableIds.deserialize(
          result.combine.droppableId
        );
        const draggableId = DraggableIds.deserialize(
          result.combine.draggableId
        );

        const stream = State.at(state, droppableId);
        if (!Stream.isStream(stream)) return;

        const index = stream.cards.findIndex(
          (card) => card.meta.key === draggableId
        );

        actions.combine(from, [...droppableId, index]);

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
    [actions, state]
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
