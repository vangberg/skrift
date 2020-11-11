import React, { useContext, useCallback } from "react";
import { StreamLocation } from "../interfaces/streams";
import { NoteCard } from "../components/NoteCard";
import { NoteID } from "../../../skrift/note";
import { useNote } from "../hooks/useNote";
import { StreamsContext } from "../hooks/useStreams";
import { Ipc } from "../ipc";

interface Props {
  id: NoteID;
  location: StreamLocation;
}

export const NoteCardContainer: React.FC<Props> = ({ id, location }) => {
  const [, { openNote, closeNote }] = useContext(StreamsContext);
  const [streamIdx] = location;
  const note = useNote(id);

  const handleDelete = useCallback(() => {
    closeNote(location);

    Ipc.send({ type: "command/DELETE_NOTE", id });
  }, [closeNote, location, id]);

  const handleOpen = useCallback(
    (id, push) => {
      const idx = push ? streamIdx + 1 : streamIdx;
      openNote(idx, id);
    },
    [openNote, streamIdx]
  );

  const handleClose = useCallback(() => closeNote(location), [
    closeNote,
    location,
  ]);

  if (!note) {
    return null;
  }

  return (
    <NoteCard
      location={location}
      note={note}
      onOpen={handleOpen}
      onDelete={handleDelete}
      onClose={handleClose}
    />
  );
};
