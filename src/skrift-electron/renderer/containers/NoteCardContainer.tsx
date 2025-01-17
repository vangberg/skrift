import React, { useCallback, useState } from "react";
import { NoteCard } from "../components/NoteCard.js";
import { useNote } from "../hooks/useNote.js";
import { Path } from "../interfaces/path/index.js";
import { NoteCard as NoteCardType } from "../interfaces/state/index.js";
import { useCardActions } from "../hooks/useCardActions.js";

interface Props {
  card: NoteCardType;
  path: Path;
}

export const NoteCardContainer: React.FC<Props> = ({ card, path }) => {
  const { onOpenNote, onDeleteNote, onClose, onUpdateMeta, onOpenSearch } = useCardActions(
    card,
    path
  );
  const { id } = card;
  const note = useNote(id);
  const [focus, setFocus] = useState(0);

  const handleDelete = useCallback(() => onDeleteNote(id), [onDeleteNote, id]);

  const handleOpenBacklinks = useCallback(() => {
    onOpenSearch(card.id, "below")
  }, [card.id, onOpenSearch]);

  const handleToggle = useCallback(() => {
    onUpdateMeta({ collapsed: !card.meta.collapsed });
  }, [onUpdateMeta, card]);

  const handleFocus = useCallback(() => {
    setFocus(focus + 1);
  }, [focus, setFocus]);

  if (!note) {
    return null;
  }

  return (
    <NoteCard
      card={card}
      note={note}
      focus={focus}
      onOpen={onOpenNote}
      onOpenBacklinks={handleOpenBacklinks}
      onDelete={handleDelete}
      onClose={onClose}
      onToggle={handleToggle}
      onFocus={handleFocus}
    />
  );
};
