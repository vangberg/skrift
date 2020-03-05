import React, { useEffect } from "react";
import { RouteComponentProps } from "@reach/router";
import { reducer, StateContext, initialState } from "../state";
import { Workspace } from "../components/Workspace";
import useElmish, { Effects } from "react-use-elmish";

export const WorkspaceContainer: React.FC<RouteComponentProps> = () => {
  const [state, dispatch] = useElmish(reducer, () => [
    initialState(),
    Effects.none()
  ]);

  useEffect(() => {
    dispatch({
      type: "notes/OPEN_FOLDER"
    });
  }, [dispatch]);

  return (
    <StateContext.Provider value={[state, dispatch]}>
      <Workspace />
    </StateContext.Provider>
  );
};
