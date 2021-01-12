import React, { useCallback, useEffect } from "react";
import { SearchCard } from "../components/SearchCard";
import { Note } from "../../../skrift/note";
import { useCache } from "../hooks/useCache";
import { Ipc } from "../ipc";
import { Serializer } from "../../../skrift/serializer";
import { Path } from "../interfaces/path";
import { SearchCard as SearchCardType } from "../interfaces/state";
import { useCardActions } from "../hooks/useCardActions";

interface Props {
  path: Path;
  card: SearchCardType;
}

export const SearchCardContainer: React.FC<Props> = ({ path, card }) => {
  const { query } = card;

  const { onOpenNote, onZoom, onClose, onUpdate } = useCardActions(card, path);

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
      onUpdate({ query });
    },
    [onUpdate]
  );

  const handleAdd = useCallback(
    (title) => {
      const id = Note.idFromDate(new Date());
      const slate = Serializer.deserialize(`# ${title}`);
      Ipc.send({ type: "command/ADD_NOTE", id, slate });
      onOpenNote(id, false);
    },
    [onOpenNote]
  );

  return (
    <SearchCard
      path={path}
      onAdd={handleAdd}
      onOpen={onOpenNote}
      onClose={onClose}
      onSearch={handleSearch}
      onZoom={onZoom}
      query={query}
      results={results}
    />
  );
};
