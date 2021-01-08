import React, { useContext, useCallback, useEffect } from "react";
import { SearchCard } from "../components/SearchCard";
import { Note, NoteID } from "../../../skrift/note";
import { useCache } from "../hooks/useCache";
import { Ipc } from "../ipc";
import { Serializer } from "../../../skrift/serializer";
import { Path } from "../interfaces/path";
import {
  SearchCard as SearchCardType,
  StateContext,
} from "../interfaces/state";

interface Props {
  path: Path;
  card: SearchCardType;
}

export const SearchCardContainer: React.FC<Props> = ({ path, card }) => {
  const { query } = card;
  const [, { openCard, updateCard, close }] = useContext(StateContext);
  const [results, setResults] = useCache<Note[]>(
    `card/${card.key}/results`,
    []
  );

  useEffect(() => {
    if (query !== "*" && query.length <= 1) {
      return setResults([]);
    }

    Ipc.search(query).then((results) => setResults(results));
  }, [query, setResults]);

  const handleSearch = useCallback(
    (query: string) => {
      updateCard(path, { query });
    },
    [updateCard, path]
  );

  const handleClose = useCallback(() => close({ path }), [close, path]);

  const handleOpen = useCallback(
    (id: NoteID, push: boolean) => {
      // FIX
      // const stream = push ? location[0] + 1 : location[0];
      openCard(Path.ancestor(path), { type: "note", id });
    },
    [openCard, path]
  );

  const handleAdd = useCallback(
    (title) => {
      const id = Note.idFromDate(new Date());
      const slate = Serializer.deserialize(`# ${title}`);
      Ipc.send({ type: "command/ADD_NOTE", id, slate });
      openCard(Path.ancestor(path), { type: "note", id });
    },
    [openCard, path]
  );

  return (
    <SearchCard
      path={path}
      onAdd={handleAdd}
      onOpen={handleOpen}
      onClose={handleClose}
      onSearch={handleSearch}
      query={query}
      results={results}
    />
  );
};
