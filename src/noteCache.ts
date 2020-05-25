import { NoteID, Note } from "./interfaces/note";
import { useState, useEffect, useContext } from "react";
import produce from "immer";
import React from "react";
import { NotesFS } from "./interfaces/notes_fs";

type Notes = Map<NoteID, string>;

type SetNotes = (notes: Notes) => void;

type GetNote = (id: NoteID) => Promise<void>;
type SetNote = (id: NoteID) => (markdown: string) => void;
type DeleteNote = (id: NoteID) => void;

interface NoteCache {
  notes: Notes;
  getNote: GetNote;
  setNote: SetNote;
  deleteNote: DeleteNote;
}

export const NoteCacheContext = React.createContext<NoteCache>({
  notes: new Map(),
  getNote: (id) => Promise.resolve(),
  setNote: (id) => (markdown) => {},
  deleteNote: (id) => {},
});

const NoteCache = {
  getNote(path: string, notes: Notes, setNotes: SetNotes) {
    return async (id: NoteID) => {
      const note = await NotesFS.read(path, id);
      setNotes(produce(notes, (draft) => draft.set(id, note.markdown)));
    };
  },

  setNote(path: string, notes: Notes, setNotes: SetNotes) {
    return (id: NoteID) => {
      return (markdown: string) => {
        NotesFS.save(path, id, markdown);
        setNotes(
          produce(notes, (draft) => {
            draft.set(id, markdown);
          })
        );
      };
    };
  },

  deleteNote(path: string, notes: Notes, setNotes: SetNotes) {
    return (id: NoteID) => {
      NotesFS.delete(path, id);
      return setNotes(
        produce(notes, (draft) => {
          draft.delete(id);
        })
      );
    };
  },
};

export const useNoteCache = (path: string): NoteCache => {
  const [notes, setNotes] = useState<Notes>(new Map());

  useEffect(() => {
    (async () => {
      const n: Notes = new Map();

      for await (let note of NotesFS.readDir(path)) {
        n.set(note.id, note.markdown);
      }

      setNotes(n);
    })();
  }, [path]);

  return {
    notes,
    getNote: NoteCache.getNote(path, notes, setNotes),
    setNote: NoteCache.setNote(path, notes, setNotes),
    deleteNote: NoteCache.deleteNote(path, notes, setNotes),
  };
};

export const useNote = (
  id: NoteID
): [Note | null, (markdown: string) => void, () => void] => {
  const cache = useContext(NoteCacheContext);

  useEffect(() => {
    cache.getNote(id);
  }, []);

  let note = null;
  const markdown = cache.notes.get(id);
  if (markdown) {
    note = { ...Note.empty({ id }), ...Note.fromMarkdown(markdown) };
  }

  return [note, cache.setNote(id), () => cache.deleteNote(id)];
};
