import React, { useEffect } from "react";
import { reducer, StateContext, initialState } from "../state";
import { Workspace } from "../components/Workspace";
import useElmish, { Effects } from "react-use-elmish";
import { ipcRenderer, remote } from "electron";
import { IpcLoadedDir, IpcLoadedNote, IpcSearchResults } from "../types";

export const WorkspaceContainer: React.FC = () => {
  const [state, dispatch] = useElmish(reducer, () => [
    initialState(),
    Effects.none(),
  ]);

  useEffect(() => {
    ipcRenderer.on("loaded-dir", (event, arg: IpcLoadedDir) => {
      dispatch({ type: "notes/SET_NOTES", notes: arg.notes });
    });
    ipcRenderer.on("loaded-note", (event, arg: IpcLoadedNote) => {
      dispatch({ type: "notes/SET_NOTE", note: arg.note });
    });
    ipcRenderer.on("search-results", (event, arg: IpcSearchResults) => {
      dispatch({ type: "search/SET_RESULTS", results: arg.ids });
    });
    ipcRenderer.send("load-dir");
  }, [dispatch]);

  return (
    <StateContext.Provider value={[state, dispatch]}>
      <Workspace />
    </StateContext.Provider>
  );
};
