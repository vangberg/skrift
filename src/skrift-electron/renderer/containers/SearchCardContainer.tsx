import React, { useCallback, useEffect } from "react";
import { SearchCard } from "../components/SearchCard.js";
import { Note } from "../../../skrift/note/index.js";
import { useCache } from "../hooks/useCache.js";
import { Ipc } from "../ipc.js";
import { Path } from "../interfaces/path/index.js";
import {
  OpenCardMode,
  SearchCard as SearchCardType,
} from "../interfaces/state/index.js";
import { useCardActions } from "../hooks/useCardActions.js";

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
