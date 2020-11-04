import { NoteID, Note } from "./interfaces/note";
import { useEffect, useState, useContext } from "react";
import clone from "fast-clone";
import { Ipc } from "./interfaces/ipc";
import produce from "immer";
import { SCache } from "./interfaces/scache";
import React from "react";
import useElmish, { Effects, Reducer, StateEffectPair } from "react-use-elmish";

type ErrorAction = { type: "ERROR"; message: string };
type ClaimNoteAction = { type: "CLAIM_NOTE"; id: NoteID };
type ScheduleReleaseNoteAction = { type: "SCHEDULE_RELEASE_NOTE"; id: NoteID };
type ReleaseNoteAction = { type: "RELEASE_NOTE"; id: NoteID };
type SetNoteAction = { type: "SET_NOTE"; note: Note };

type Action =
  | ErrorAction
  | ClaimNoteAction
  | ScheduleReleaseNoteAction
  | ReleaseNoteAction
  | SetNoteAction;

type NoteCache = SCache<NoteID, Note>;

type ActionHandler<SubAction> = (
  cache: NoteCache,
  action: SubAction
) => StateEffectPair<NoteCache, Action>;

const errorHandler = (error: Error): Action => {
  return { type: "ERROR", message: error.message };
};

const handleClaimNote: ActionHandler<ClaimNoteAction> = (cache, action) => {
  const { id } = action;

  return [
    produce(cache, (draft) => {
      SCache.claim(draft, id);
    }),
    Effects.attemptFunction(
      () => Ipc.send({ type: "command/LOAD_NOTE", id }),
      errorHandler
    ),
  ];
};

/*
When a note is moved from one stream to another, there is (sometimes)
a tiny moment where the component for the dragged note is unmounted
before the component for the note in the destination stream is mounted.
This means that the note is removed from the cache, and has to be loaded,
causing a small flicker. By delaying the release a bit, we ensure that
the new component can claim the note before it is removed from the cache.
*/
const handleScheduleReleaseNote: ActionHandler<ScheduleReleaseNoteAction> = (
  cache,
  action
) => {
  const { id } = action;

  return [cache, Effects.delay({ type: "RELEASE_NOTE", id }, 1000)];
};

const handleReleaseNote: ActionHandler<ReleaseNoteAction> = (cache, action) => {
  const { id } = action;

  return [
    produce(cache, (draft) => {
      SCache.release(draft, id);
    }),
    Effects.none(),
  ];
};

const handleSetNote: ActionHandler<SetNoteAction> = (cache, action) => {
  const { note } = action;

  return [
    produce(cache, (draft) => {
      SCache.set(draft, note.id, note);
    }),
    Effects.none(),
  ];
};

const reducer: Reducer<NoteCache, Action> = (cache, action) => {
  switch (action.type) {
    case "ERROR":
      return [cache, Effects.none()];
    case "CLAIM_NOTE":
      return handleClaimNote(cache, action);
    case "SCHEDULE_RELEASE_NOTE":
      return handleScheduleReleaseNote(cache, action);
    case "RELEASE_NOTE":
      return handleReleaseNote(cache, action);
    case "SET_NOTE":
      return handleSetNote(cache, action);
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
      }
    });

    return deregister;
  }, [dispatch]);

  return [cache, dispatch];
};

const cloneNote = (note: Note): Note => ({ ...note, slate: clone(note.slate) });

export const useNote = (id: NoteID): Note | null => {
  const [cache, dispatch] = useContext(NoteCacheContext);
  const cachedNote = SCache.get(cache, id);

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
