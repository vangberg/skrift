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
  const [, { openCard, zoomCard, close }] = useContext(StateContext);
  const { id } = card;
  const note = useNote(id);

  const handleDelete = useCallback(() => {
    close({ match: { type: "note", id } });

    Ipc.send({ type: "command/DELETE_NOTE", id });
  }, [close, id]);

  const handleOpen = useCallback(
    (id, push) => {
      const currentStreamPath = Path.ancestor(path);
      const streamPath = push
        ? Path.next(currentStreamPath)
        : currentStreamPath;
      openCard(streamPath, { type: "note", id });
    },
    [openCard, path]
  );

  const handleZoom = useCallback(() => {
    zoomCard(path);
  }, [zoomCard, path]);

  const handleClose = useCallback(() => close({ path }), [close, path]);

  if (!note) {
    return null;
  }

  return (
    <NoteCard
      path={path}
      note={note}
      onOpen={handleOpen}
      onZoom={handleZoom}
      onDelete={handleDelete}
      onClose={handleClose}
    />
  );
};
