import React, { useEffect, useState } from "react";
import { Workspace } from "../components/Workspace";
import { DevInfo } from "../components/DevInfo";
import { Splash } from "../components/Splash";
import { useImmer } from "use-immer";
import { CacheContext } from "../hooks/useCache";
import { Ipc } from "../ipc";

export const WorkspaceContainer: React.FC = () => {
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
  }, []);

  return (
    <CacheContext.Provider value={cacheContext}>
      <DevInfo />
      {loading ? <Splash loaded={loaded} /> : <Workspace />}
    </CacheContext.Provider>
  );
};
