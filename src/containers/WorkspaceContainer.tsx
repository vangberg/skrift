import React from "react";
import { reducer, StateContext, initialState } from "../state";
import { Workspace } from "../components/Workspace";
import useElmish, { Effects } from "react-use-elmish";
import { useNoteCache, NoteCacheContext } from "../noteCache";

export const WorkspaceContainer: React.FC = () => {
  const [state, dispatch] = useElmish(reducer, () => [
    initialState(),
    Effects.none(),
  ]);

  const noteCache = useNoteCache(state.path);

  return (
    <StateContext.Provider value={[state, dispatch]}>
      <NoteCacheContext.Provider value={noteCache}>
        <Workspace />
      </NoteCacheContext.Provider>
    </StateContext.Provider>
  );
};
