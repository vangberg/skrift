import React, { useEffect, useState } from "react";
import { RouteComponentProps } from "@reach/router";
import { reducer, StateContext, initialState } from "../state";
import { Workspace } from "../components/Workspace";
import { Search, SearchContext } from "../search";
import useElmish, { Effects } from "react-use-elmish";

export const WorkspaceContainer: React.FC<RouteComponentProps> = () => {
  const [index] = useState(() => Search.makeIndex());
  const [state, dispatch] = useElmish(reducer, () => [
    initialState(),
    Effects.none()
  ]);

  useEffect(() => {
    dispatch({
      type: "notes/OPEN_FOLDER"
    });
  }, []);

  useEffect(() => {
    const query = state.search.query;

    if (query === "") {
      dispatch({ type: "search/CLEAR_RESULTS" });
    } else {
      Search.search(index, query).then(results => {
        dispatch({ type: "search/SET_RESULTS", results });
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
