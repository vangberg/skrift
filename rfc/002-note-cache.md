# Note Cache

## Todo

- Only store needed notes.
- SUBSCRIBE/UNSUBSCRIBE.
- Use reference counting.

## Problems

### Limit memory usage

Storing everything in-memory works up until a point. 10,000 notes take up
approximately ~50 MB of memory. I want Skrift to work with 100,000 notes, which
would take up ~500 MB of memory. In-memory search doubles that requirement, and
we end up with an unacceptable amount of memory use.

## Solution

We will create a "note cache" that is responsible for storing notes in memory.
It will sit between the application code and the file system, and all
persistence will be abstracted away as far as the application is concerned.
I.e., all calls to `NotesFS` will be performed by the note cache.

## API

We will implement the note cache as a hook, with the following API:

```typescript
type Notes = Map<NoteID, Note | null>;

# Setting up the note cache
const [notes, setNote, deleteNote] = useNoteCache("~/path/to/folder");
setNote(id, note);
deleteNote(id);

# Reading a single note
const [note, setNote, deleteNote] = useNote(id);
setNote(note);
deleteNote();

import { NoteCacheContext } from './noteCache'
<NoteCacheContext.Provider value={notes}>
  …
</NoteCacheContext.Provider>
```

The note cache will use it owns state, and only load notes when they are needed.
No garbage collection will be done at first.

## Implementation

```typescript
type Notes = Map<NoteID, string>;

type SetNotes = (notes: Notes) => void;

const NoteCache = {
  setNote(cache:, setNotes: SetNotes) {
    return (id: NoteID) => {
      return (markdown: string): Notes => {
        setNotes(notes.set(id, markdown));
        NotesFS.save(path, id, markdown);
      };
    };
  },

  deleteNote(path: string, notes: Notes, setNotes: SetNotes) {
    return (id: NoteID) => {
      setNotes(notes.delete(id));
      NotesFS.delete(path, id);
    };
  },
};

const useNoteCache = (path: string) => {
  const [notes, setNotes] = useState<Notes>(new Map());

  useEffect(() => {
    const n = new Map();

    for await (let note of NotesFS.readDir(path)) {
      n.set(note.id, note);
    }

    setNotes(n);
  });

  return [
    notes,
    NoteCache.setNote(path, notes, setNotes),
    NoteCache.deleteNote(path, notes, setNotes),
  ];
};

const useNote = (id: NoteID) => {
  const [notes, setNote, deleteNote] = useContext(NoteCacheContext.Consumer);

  const markdown = notes.get(id);

  if (markdown) {
    const note = { ...Note.empty(), ...Note.fromMarkdown(markdown) };
  }

  return [note, setNote(id), deleteNote(id)];
};
```
