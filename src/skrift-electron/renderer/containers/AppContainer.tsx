import React, { useEffect, useMemo, useState } from "react";
import { useImmer } from "use-immer";
import { Splash } from "../components/Splash.js";
import { CacheContext } from "../hooks/useCache.js";
import { Ipc } from "../ipc.js";
import { createStateActions, State, StateContext } from "../interfaces/state/index.js";
import { StreamsContainer } from "./StreamsContainer.js";

export const AppContainer: React.FC = () => {
  const cacheContext = useImmer({});

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

  return (
    <CacheContext.Provider value={cacheContext}>
      <StateContext.Provider value={[state, actions]}>
        {loading ? (
          <Splash loaded={loaded} />
        ) : (
          <StreamsContainer />
        )}
      </StateContext.Provider>
    </CacheContext.Provider>
  );
};
