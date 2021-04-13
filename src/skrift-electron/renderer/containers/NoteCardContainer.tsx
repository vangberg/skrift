import React, { useCallback } from "react";
import { NoteCard } from "../components/NoteCard";
import { useNote } from "../hooks/useNote";
import { Path } from "../interfaces/path";
import { NoteCard as NoteCardType } from "../interfaces/state";
import { useCardActions } from "../hooks/useCardActions";

interface Props {
  card: NoteCardType;
  path: Path;
}

export const NoteCardContainer: React.FC<Props> = ({ card, path }) => {
  const { onOpenNote, onDeleteNote, onClose, onUpdateMeta } = useCardActions(
    card,
    path
  );
  const { id } = card;
  const note = useNote(id);

  const handleDelete = useCallback(() => onDeleteNote(id), [onDeleteNote, id]);

  const handleToggle = useCallback(() => {
    onUpdateMeta({ collapsed: !card.meta.collapsed });
  }, [onUpdateMeta, card]);

  if (!note) {
    return null;
  }

  return (
    <NoteCard
      path={path}
      card={card}
      note={note}
      onOpen={onOpenNote}
      onDelete={handleDelete}
      onClose={onClose}
      onToggle={handleToggle}
    />
  );
};
