import React, { useEffect, useState } from "react";
import { RouteComponentProps } from "@reach/router";
import { reducer, StateContext, initialState } from "../state";
import { Store, StoreContext } from "../store";
import { Workspace } from "../components/Workspace";
import { Search, SearchContext } from "../search";
import { Notes } from "../interfaces/notes";
import useElmish, { Effects } from "react-use-elmish";
import { NotesFS } from "../interfaces/notes_fs";

export const WorkspaceContainer: React.FC<RouteComponentProps> = () => {
  const [store] = useState(() => new Store());

  const [state, dispatch] = useElmish(reducer, () => [
    initialState(),
    Effects.none()
  ]);

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

  const [search] = useState(() => new Search());
  useEffect(() => {
    return search.subscribe(store);
  }, [search, store]);
  useEffect(() => {
    const query = state.search.query;

    if (query === "") {
      dispatch({ type: "@search/CLEAR_RESULTS" });
    } else {
      search.search(query).then(results => {
        dispatch({ type: "@search/SET_RESULTS", results });
      });
    }
  }, [state.search.query, search, dispatch]);

  useEffect(() => {
    store.readAll();
  }, [store]);

  return (
    <StoreContext.Provider value={store}>
      <SearchContext.Provider value={search}>
        <StateContext.Provider value={[state, dispatch]}>
          <Workspace openIds={state.openIds} />
        </StateContext.Provider>
      </SearchContext.Provider>
    </StoreContext.Provider>
  );
};
