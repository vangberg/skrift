import React, { useContext, useCallback, useState, useEffect } from "react";
import { StateContext } from "../state";
import { Note, NoteID } from "../interfaces/note";
import { StreamLocation, StreamSearchCard } from "../interfaces/streams";
import { SearchCard } from "../components/SearchCard";
import { Ipc } from "../interfaces/ipc";
import { Serializer } from "../interfaces/serializer";
import { useCache } from "../useCache";

interface Props {
  location: StreamLocation;
  card: StreamSearchCard;
}

export const SearchCardContainer: React.FC<Props> = ({ location, card }) => {
  const [state, dispatch] = useContext(StateContext);
  const { streams } = state;
  const [query, setQuery] = useCache(`card/${card.key}/query`, "");
  const [results, setResults] = useCache<Note[]>(
    `card/${card.key}/results`,
    []
  );

  useEffect(() => {
    if (query.length <= 1) {
      return setResults([]);
    }

    Ipc.search(query).then(setResults);
  }, [query, setResults]);

  const handleSearch = useCallback((query: string) => setQuery(query), [
    setQuery,
  ]);

  const handleClose = useCallback(
    () => dispatch({ type: "streams/CLOSE_NOTE", location }),
    [dispatch, location]
  );

  const handleOpen = useCallback(
    (id: NoteID, push: boolean) => {
      const stream = push ? location[0] + 1 : location[0];
      dispatch({ type: "streams/OPEN_NOTE", stream, id });
    },
    [location, dispatch]
  );

  const handleAdd = useCallback(
    (title) => {
      const id = Note.idFromDate(new Date());
      const slate = Serializer.deserialize(`# ${title}`);
      Ipc.send({ type: "command/ADD_NOTE", id, slate });
      setQuery("");
      dispatch({
        type: "streams/OPEN_NOTE",
        stream: streams.length - 1,
        id,
      });
    },
    [streams, dispatch]
  );

  return (
    <SearchCard
      location={location}
      onAdd={handleAdd}
      onOpen={handleOpen}
      onClose={handleClose}
      onSearch={handleSearch}
      query={query}
      results={results}
    />
  );
};
