import React, { useContext, useCallback } from "react";
import { NoteCard } from "../components/NoteCard";
import { useNote } from "../hooks/useNote";
import { Ipc } from "../ipc";
import { Path } from "../interfaces/path";
import { NoteCard as NoteCardType, StateContext } from "../interfaces/state";

interface Props {
  card: NoteCardType;
  path: Path;
}

export const NoteCardContainer: React.FC<Props> = ({ card, path }) => {
  const [, { openCard, close }] = useContext(StateContext);
  const { id } = card;
  const note = useNote(id);

  const handleDelete = useCallback(() => {
    close({ match: { type: "note", id } });

    Ipc.send({ type: "command/DELETE_NOTE", id });
  }, [close, id]);

  const handleOpen = useCallback(
    (id, push) => {
      // FIX
      // const idx = push ? streamIdx + 1 : streamIdx;
      openCard(Path.ancestor(path), { type: "note", id });
    },
    [openCard, path]
  );

  const handleClose = useCallback(() => close({ path }), [close, path]);

  if (!note) {
    return null;
  }

  return (
    <NoteCard
      path={path}
      note={note}
      onOpen={handleOpen}
      onDelete={handleDelete}
      onClose={handleClose}
    />
  );
};
