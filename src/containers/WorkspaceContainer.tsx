import React, { useEffect, useState, useCallback } from "react";
import { RouteComponentProps } from "@reach/router";
import { reducer, StateContext, initialState } from "../state";
import { Workspace } from "../components/Workspace";
import { Search, SearchContext } from "../search";
import { Notes } from "../interfaces/notes";
import useElmish, { Effects } from "react-use-elmish";
import { NotesFS } from "../interfaces/notes_fs";

export const WorkspaceContainer: React.FC<RouteComponentProps> = () => {
  const [state, elmishDispatch] = useElmish(reducer, () => [
    initialState(),
    Effects.none()
  ]);
  const [index] = useState(() => Search.makeIndex());
  const dispatch = useCallback(
    Search.dispatchWithSearch(elmishDispatch, index),
    [elmishDispatch]
  );

  useEffect(() => {
    NotesFS.readAll().then(notes => {
      dispatch({
        type: "SET_NOTES",
        notes
      });
      dispatch({
        type: "OPEN_NOTES",
        ids: Notes.byDate(notes)
          .map(note => note.id)
          .slice(0, 3)
      });
    });
  }, []);

  useEffect(() => {
    const query = state.search.query;

    if (query === "") {
      dispatch({ type: "@search/CLEAR_RESULTS" });
    } else {
      Search.search(index, query).then(results => {
        dispatch({ type: "@search/SET_RESULTS", results });
      });
    }
  }, [state.search.query, dispatch, index]);

  return (
    <SearchContext.Provider value={index}>
      <StateContext.Provider value={[state, dispatch]}>
        <Workspace openIds={state.openIds} />
      </StateContext.Provider>
    </SearchContext.Provider>
  );
};
