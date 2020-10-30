// import React, { useContext, useCallback, useMemo } from "react";
// import { NoteList } from "../components/StreamSearch";
// import { StateContext } from "../state";
// import { Streams } from "../interfaces/streams";
// import { NoteIndex } from "../interfaces/noteIndex";
// import { Serializer } from "../interfaces/serializer";
// import { Ipc } from "../interfaces/ipc";
// import { Note } from "../interfaces/note";

// export const NoteListContainer: React.FC = () => {
//   const [state, dispatch] = useContext(StateContext);
//   const { notes, search, streams } = state;
//   const { query, results } = search;

//   const notes_ = useMemo(() => {
//     if (query === "") {
//       return NoteIndex.byModifiedAt(notes).slice(0, 100);
//     } else {
//       return NoteIndex.byIds(notes, results);
//     }
//   }, [query, results, notes]);

//   const handleAdd = useCallback(
//     (title) => {
//       const id = Note.idFromDate(new Date());
//       const slate = Serializer.deserialize(`# ${title}`);
//       Ipc.send({ type: "command/ADD_NOTE", id, slate });
//       dispatch({ type: "streams/OPEN_NOTE", stream: streams.length - 1, id });
//       dispatch({ type: "search/SET_QUERY", query: "" });
//     },
//     [dispatch, streams]
//   );

//   const handleSearch = useCallback(
//     (query) => {
//       dispatch({ type: "search/SET_QUERY", query });
//       Ipc.send({ type: "command/SEARCH", query });
//     },
//     [dispatch]
//   );

//   const handleOpen = useCallback(
//     (id, push) => {
//       // cmd/ctrl-click should open note in a new stream
//       const stream = push
//         ? Streams.next(state.streams)
//         : Streams.last(state.streams);
//       dispatch({ type: "streams/OPEN_NOTE", stream, id });
//     },
//     [dispatch, state.streams]
//   );

//   return (
//     <NoteList
//       notes={notes_}
//       query={search.query}
//       onAdd={handleAdd}
//       onOpen={handleOpen}
//       onSearch={handleSearch}
//     />
//   );
// };
