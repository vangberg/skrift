import React, { useCallback, useEffect } from "react";
import { SearchCard } from "../components/SearchCard.js";
import { Note, NoteLink } from "../../../skrift/note/index.js";
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

  const [keywordResults, setKeywordResults] = useCache<NoteLink[]>(
    `card/${card.meta.key}/keywordResults`,
    []
  );
  const [semanticResults, setSemanticResults] = useCache<NoteLink[]>(
    `card/${card.meta.key}/semanticResults`,
    []
  );

  useEffect(() => {
    if (query !== "*" && query.length <= 1) {
      return setKeywordResults([]);
    }

    Ipc.send({ type: "command/SEARCH", query });

    const deregister = Ipc.on((event) => {
      if (event.type === "event/SEARCH_RESULT" && event.query === query) {
        setKeywordResults(event.keyword);
        setSemanticResults(event.semantic);
      }
    });

    return deregister;
  }, [query, setKeywordResults, setSemanticResults]);

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
      keywordResults={keywordResults}
      semanticResults={semanticResults}
    />
  );
};
