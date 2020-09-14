import React, { useEffect } from "react";
import { reducer, StateContext, initialState } from "../state";
import { Workspace } from "../components/Workspace";
import useElmish, { Effects } from "react-use-elmish";
import { ipcRenderer } from "electron";
import { IpcSearchResults } from "../types";
import { Ipc } from "../interfaces/ipc";

export const WorkspaceContainer: React.FC = () => {
  const [state, dispatch] = useElmish(reducer, () => [
    initialState(),
    Effects.none(),
  ]);

  useEffect(() => {
    const deregister = Ipc.on((event) => {
      switch (event.type) {
        case "event/LOADED_DIR":
          dispatch({ type: "notes/SET_NOTES", notes: event.notes });
          break;
        case "event/SET_NOTE":
          dispatch({ type: "notes/SET_NOTE", note: event.note });
          break;
        case "event/DELETED_NOTE":
          dispatch({ type: "notes/DELETE_NOTE", id: event.id });
          break;
      }
    });

    ipcRenderer.on("search-results", (event, arg: IpcSearchResults) => {
      dispatch({ type: "search/SET_RESULTS", results: arg.ids });
    });

    Ipc.send({ type: "command/LOAD_DIR" });

    return deregister;
  }, [dispatch]);

  return (
    <StateContext.Provider value={[state, dispatch]}>
      <Workspace />
    </StateContext.Provider>
  );
};
