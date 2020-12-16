import React, { useEffect, useState } from "react";
import { Workspace } from "../components/Workspace";
import { DevInfo } from "../components/DevInfo";
import { Splash } from "../components/Splash";
import { useImmer } from "use-immer";
import { CacheContext } from "../hooks/useCache";
import { Ipc } from "../ipc";
import { StreamsContext, useStreams } from "../hooks/useStreams";

export const AppContainer: React.FC = () => {
  const cacheContext = useImmer(new Map());
  const [streams, actions] = useStreams();

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
  }, []);

  return (
    <CacheContext.Provider value={cacheContext}>
      <StreamsContext.Provider value={[streams, actions]}>
        <DevInfo />
        {loading ? <Splash loaded={loaded} /> : <Workspace />}
      </StreamsContext.Provider>
    </CacheContext.Provider>
  );
};
