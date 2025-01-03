import React, { useCallback, useEffect } from "react";
import { SearchCard } from "../components/SearchCard";
import { Note } from "../../../skrift/note";
import { useCache } from "../hooks/useCache";
import { Ipc } from "../ipc";
import { Path } from "../interfaces/path";
import {
  OpenCardMode,
  SearchCard as SearchCardType,
} from "../interfaces/state";
import { useCardActions } from "../hooks/useCardActions";

interface Props {
  path: Path;
  card: SearchCardType;
}

export const SearchCardContainer: React.FC<Props> = ({ path, card }) => {
  const { query } = card;

  const { onOpenNote, onClose, onUpdate } = useCardActions(card, path);

  const [results, setResults] = useCache<Note[]>(
    `card/${card.meta.key}/results`,
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
    (title: string, mode: OpenCardMode) => {
      const id = Note.idFromDate(new Date());
      const markdown = `# ${title}`;
      Ipc.send({ type: "command/ADD_NOTE", id, markdown });
      onOpenNote(id, mode);
    },
    [onOpenNote]
  );

  return (
    <SearchCard
      onAdd={handleAdd}
      onOpen={onOpenNote}
      onClose={onClose}
      onSearch={handleSearch}
      query={query}
      results={results}
    />
  );
};
