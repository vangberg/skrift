import React, { useEffect, useContext, useReducer } from "react";
import { reducer, StateContext } from "../state";
import { StoreContext } from "../store";
import { NoteEditorContainer } from "./NoteEditorContainer";
import { NoteListContainer } from "./NoteListContainer";

export const AppContainer: React.FC = () => {
  const store = useContext(StoreContext);
  const [state, dispatch] = useReducer(reducer, {}, () => {
    const notes = store.getNotes();
    return {
      notes,
      openIds: [...notes.keys()].slice(0, 3)
    };
  });

  useEffect(() => {
    store.onUpdate(() =>
      dispatch({
        type: "SET_NOTES",
        notes: store.getNotes()
      })
    );
  }, [store]);

  return (
    <StateContext.Provider value={[state, dispatch]}>
      <div className="flex flex-1 bg-gray-100">
        <div className="p-2 max-w-xs bg-white border-r-2">
          <NoteListContainer />
        </div>

        <div className="flex-grow p-2 overflow-y-scroll">
          {[...state.openIds].map(id => (
            <NoteEditorContainer key={id} id={id} />
          ))}
        </div>
      </div>
    </StateContext.Provider>
  );
};