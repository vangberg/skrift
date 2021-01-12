import { useCallback, useContext } from "react";
import { NoteID } from "../../../skrift/note";
import { Path } from "../interfaces/path";
import { Card, StateContext } from "../interfaces/state";
import { Ipc } from "../ipc";

interface CardActions<T extends Card> {
  onDeleteNote: (id: NoteID) => void;
  onOpenNote: (id: NoteID, push: boolean) => void;
  onOpenSearch: (query: string, push: boolean) => void;
  onZoom: () => void;
  onClose: () => void;
  onUpdate: (card: Partial<T>) => void;
}

export const useCardActions = <T extends Card>(
  card: T,
  path: Path
): CardActions<T> => {
  const [, { openCard, updateCard, zoomCard, close }] = useContext(
    StateContext
  );

  const onDeleteNote = useCallback(
    (id: NoteID) => {
      close({ match: { type: "note", id } });

      Ipc.send({ type: "command/DELETE_NOTE", id });
    },
    [close]
  );

  const onOpenNote = useCallback(
    (id, push) => {
      const currentStreamPath = Path.ancestor(path);
      const streamPath = push
        ? Path.next(currentStreamPath)
        : currentStreamPath;
      openCard(streamPath, { type: "note", id });
    },
    [openCard, path]
  );

  const onOpenSearch = useCallback(
    (query, push) => {
      const currentStreamPath = Path.ancestor(path);
      const streamPath = push
        ? Path.next(currentStreamPath)
        : currentStreamPath;
      openCard(streamPath, { type: "search", query });
    },
    [openCard, path]
  );

  const onZoom = useCallback(() => {
    zoomCard(path);
  }, [zoomCard, path]);

  const onClose = useCallback(() => close({ path }), [close, path]);

  const onUpdate = useCallback(
    (changes: Partial<T>) => updateCard(path, changes),
    [updateCard, path]
  );

  return {
    onDeleteNote,
    onOpenNote,
    onOpenSearch,
    onZoom,
    onClose,
    onUpdate,
  };
};
