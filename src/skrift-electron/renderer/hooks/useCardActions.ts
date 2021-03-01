import { useCallback, useContext } from "react";
import { NoteID } from "../../../skrift/note";
import { Path } from "../interfaces/path";
import { Card, OpenCardMode, StateContext } from "../interfaces/state";
import { Ipc } from "../ipc";

interface CardActions<T extends Card> {
  onDeleteNote: (id: NoteID) => void;
  onOpenNote: (id: NoteID, mode: OpenCardMode) => void;
  onOpenSearch: (query: string, mode: OpenCardMode) => void;
  onSelect: (options?: { multi: boolean }) => void;
  onDeselect: () => void;
  onZoom: () => void;
  onClose: () => void;
  onUpdate: (card: Partial<T>) => void;
}

export const useCardActions = <T extends Card>(
  card: T,
  path: Path
): CardActions<T> => {
  const [
    ,
    { openCard, updateCard, zoom, selectCard, deselectCard, close },
  ] = useContext(StateContext);

  const onDeleteNote = useCallback(
    (id: NoteID) => {
      close({ match: { type: "note", id } });

      Ipc.send({ type: "command/DELETE_NOTE", id });
    },
    [close]
  );

  const onOpenNote = useCallback(
    (id: NoteID, mode: OpenCardMode) => {
      openCard(path, mode, { type: "note", id });
    },
    [openCard, path]
  );

  const onOpenSearch = useCallback(
    (query: string, mode: OpenCardMode) => {
      openCard(path, mode, { type: "search", query });
    },
    [openCard, path]
  );

  const onZoom = useCallback(() => {
    zoom(path);
  }, [zoom, path]);

  const onSelect = useCallback(
    (options?: { multi: boolean }) => {
      selectCard(path, options);
    },
    [selectCard, path]
  );

  const onDeselect = useCallback(() => {
    deselectCard(path);
  }, []);

  const onClose = useCallback(() => close({ path }), [close, path]);

  const onUpdate = useCallback(
    (changes: Partial<T>) => updateCard(path, changes),
    [updateCard, path]
  );

  return {
    onDeleteNote,
    onOpenNote,
    onOpenSearch,
    onSelect,
    onDeselect,
    onZoom,
    onClose,
    onUpdate,
  };
};
