import React, { useContext, useCallback, useEffect } from "react";
import { StreamLocation, StreamSearchCard } from "../interfaces/streams";
import { SearchCard } from "../components/SearchCard";
import { Note, NoteID } from "../../../skrift/note";
import { useCache } from "../hooks/useCache";
import { StreamsContext } from "../hooks/useStreams";
import { Ipc } from "../ipc";
import { Serializer } from "../../../skrift/serializer";

interface Props {
  location: StreamLocation;
  card: StreamSearchCard;
}

export const SearchCardContainer: React.FC<Props> = ({ location, card }) => {
  const [streams, { closeNote, openNote }] = useContext(StreamsContext);
  const [query, setQuery] = useCache(`card/${card.key}/query`, "");
  const [results, setResults] = useCache<Note[]>(
    `card/${card.key}/results`,
    []
  );

  useEffect(() => {
    if (query.length <= 1) {
      return setResults([]);
    }

    Ipc.search(query).then((results) => setResults(results.slice(0, 100)));
  }, [query, setResults]);

  const handleSearch = useCallback((query: string) => setQuery(query), [
    setQuery,
  ]);

  const handleClose = useCallback(() => closeNote(location), [
    closeNote,
    location,
  ]);

  const handleOpen = useCallback(
    (id: NoteID, push: boolean) => {
      const stream = push ? location[0] + 1 : location[0];
      openNote(stream, id);
    },
    [location, openNote]
  );

  const handleAdd = useCallback(
    (title) => {
      const id = Note.idFromDate(new Date());
      const slate = Serializer.deserialize(`# ${title}`);
      Ipc.send({ type: "command/ADD_NOTE", id, slate });
      openNote(streams.length - 1, id);
    },
    [openNote, streams]
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
