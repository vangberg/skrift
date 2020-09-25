import { NoteID, Note } from "./interfaces/note";
import { useEffect, useState, useContext } from "react";
import clone from "fast-clone";
import { Ipc } from "./interfaces/ipc";
import produce from "immer";
import { NoteCache } from "./interfaces/noteCache";
import React from "react";
import useElmish, { Effects, Reducer, StateEffectPair } from "react-use-elmish";

type ClaimNoteAction = { type: "CLAIM_NOTE"; id: NoteID };
type ScheduleReleaseNoteAction = { type: "SCHEDULE_RELEASE_NOTE"; id: NoteID };
type ReleaseNoteAction = { type: "RELEASE_NOTE"; id: NoteID };
type SetNoteAction = { type: "SET_NOTE"; note: Note };
type AddLinkAction = { type: "ADD_LINK"; from: NoteID; to: NoteID };
type DeleteLinkAction = { type: "DELETE_LINK"; from: NoteID; to: NoteID };

type Action =
  | ClaimNoteAction
  | ScheduleReleaseNoteAction
  | ReleaseNoteAction
  | SetNoteAction
  | AddLinkAction
  | DeleteLinkAction;

type ActionHandler<SubAction> = (
  cache: NoteCache,
  action: SubAction
) => StateEffectPair<NoteCache, Action>;

const handleClaimNote: ActionHandler<ClaimNoteAction> = (cache, action) => {
  const { id } = action;

  return [
    produce(cache, (draft) => {
      NoteCache.claim(draft, id);
    }),
    Effects.none(),
  ];
};

const handleScheduleReleaseNote: ActionHandler<ScheduleReleaseNoteAction> = (
  cache,
  action
) => {
  const { id } = action;

  return [cache, Effects.delay({ type: "RELEASE_NOTE", id }, 5000)];
};

const handleReleaseNote: ActionHandler<ReleaseNoteAction> = (cache, action) => {
  const { id } = action;

  return [
    produce(cache, (draft) => {
      NoteCache.release(draft, id);
    }),
    Effects.none(),
  ];
};

const handleSetNote: ActionHandler<SetNoteAction> = (cache, action) => {
  const { note } = action;

  return [
    produce(cache, (draft) => {
      NoteCache.set(draft, note);
    }),
    Effects.none(),
  ];
};

const handleAddLink: ActionHandler<AddLinkAction> = (cache, action) => {
  // We use this event to manually update backlinks.
  const { from, to } = action;

  return [
    produce(cache, (draft) => {
      // Check whether we have the note that is linked to.
      const note = NoteCache.get(draft, to);

      if (!note) {
        return;
      }

      // Add the note that is linked from as a backlink.
      note.backlinks.add(from);
    }),
    Effects.none(),
  ];
};

const handleDeleteLink: ActionHandler<DeleteLinkAction> = (cache, action) => {
  // We use this event to manually update backlinks.
  const { from, to } = action;

  return [
    produce(cache, (draft) => {
      // Check whether we have the note that is linked to.
      const note = NoteCache.get(draft, to);

      if (!note) {
        return;
      }

      // Remove the note that is linked from as a backlink.
      note.backlinks.delete(from);
    }),
    Effects.none(),
  ];
};

const reducer: Reducer<NoteCache, Action> = (cache, action) => {
  switch (action.type) {
    case "CLAIM_NOTE":
      return handleClaimNote(cache, action);
    case "SCHEDULE_RELEASE_NOTE":
      return handleScheduleReleaseNote(cache, action);
    case "RELEASE_NOTE":
      return handleReleaseNote(cache, action);
    case "SET_NOTE":
      return handleSetNote(cache, action);
    case "ADD_LINK":
      return handleAddLink(cache, action);
    case "DELETE_LINK":
      return handleDeleteLink(cache, action);
  }
};

export const useNoteCache = (): Context => {
  const [cache, dispatch] = useElmish(reducer, () => [
    new Map(),
    Effects.none(),
  ]);

  useEffect(() => {
    const deregister = Ipc.on((event) => {
      switch (event.type) {
        case "event/SET_NOTE":
          return dispatch({ type: "SET_NOTE", note: event.note });
        case "event/ADDED_LINK":
          return dispatch({ type: "ADD_LINK", from: event.from, to: event.to });
        case "event/DELETED_LINK":
          return dispatch({
            type: "DELETE_LINK",
            from: event.from,
            to: event.to,
          });
      }
    });

    return deregister;
  }, [dispatch]);

  return [cache, dispatch];
};

const cloneNote = (note: Note): Note => ({ ...note, slate: clone(note.slate) });

export const useNote = (id: NoteID): Note | null => {
  const [cache, dispatch] = useContext(NoteCacheContext);
  const cachedNote = NoteCache.get(cache, id);

  /*
  When the same value is used by multiple instances of Slate,
  the last instance will always steal focus. We fix this at the
  "root" by cloning the value here, before passing it on to React/Slate.
  */
  const [note, setNote] = useState<Note | null>(() => {
    return cachedNote ? cloneNote(cachedNote) : null;
  });

  useEffect(() => {
    dispatch({ type: "CLAIM_NOTE", id });

    return () => {
      dispatch({ type: "SCHEDULE_RELEASE_NOTE", id });
    };
  }, [id, dispatch]);

  useEffect(() => {
    // We don't want to load the note if it has already been loaded.
    // This could be handled better by using useElmish and have the
    // CLAIM_NOTE handler send the LOAD_NOTE event.
    if (!note) {
      Ipc.send({ type: "command/LOAD_NOTE", id });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    /*
    When the same value is used by multiple instances of Slate,
    the last instance will always steal focus. We fix this at the
    "root" by cloning the value here, before passing it on to React/Slate.
    */
    if (cachedNote) {
      setNote({ ...cachedNote, slate: clone(cachedNote.slate) });
    }
  }, [cachedNote]);

  return note;
};

type Context = [NoteCache, React.Dispatch<Action>];
export const NoteCacheContext = React.createContext<Context>([
  new Map(),
  () => {},
]);
