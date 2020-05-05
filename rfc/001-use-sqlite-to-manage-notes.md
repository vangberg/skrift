# Use SQLite to manage notes

## Problems

### Limit memory usage

Storing everything in-memory works up until a point. 10,000 notes take
up approximately ~50 MB of memory. I want Skrift to work with 100,000
notes, which would take up ~500 MB of memory. In-memory search doubles
that requirement, and we end up with an unacceptable amount of memory
use.

### Better search

The in-memory JavaScript full-text search solutions all have dfferent
drawbacks so far:

- FlexSearch is buggy, adding new objects sometimes stops working, and
  it seems like maintenance of the project has stopped.
- MiniSearch is nice, but it is difficult to delete objects from the
  index, since you need to do it by the indexed record, instead of a
  simple ID.

## What SQLite offers

SQLite works with a file on-disk, meaning we can limit ourselves to
loading open notes into memory. This effectively means the limit to
the number of notes that Skrift can work with is limited by SQLite
performance, which anecdotally seems to be good:

> For this test, we’ve populated products table with over 1.2 million rows.
> [..] The search string “model” time: 0.20s

https://medium.com/flawless-app-stories/how-to-use-full-text-search-on-ios-7cc4553df0e0

## Implementation

The database layer exists without knowing anything anything about files.
At startup all notes are read from disk and added to the database, and
when a note is changed, it is persisted both to the database and the
filesystem.

### Initializing

```typescript
const db = NotesDB.initialize();
NotesFS.readEach("~/Documents/Skrift", (note) => {
  NotesDB.add(db, note);
});
```

### Saving changes

```typescript
export const saveNote = (state, action) => {
  const { db, path } = state;
  const { id, value } = action;
  const markdown = Serializer.serialize(value);

  return [
    state,
    Effects.combine(
      Effects.attemptPromise(
        () => NotesDB.save(db, id, markdown),
        errorHandler
      ),
      Effects.attemptPromise(
        () => NotesFS.save(path, id, markdown),
        errorHandler
      )
    ),
  ];
};
```

### Reading notes

A note may be needed by several components (a note can be opened multiple
times, and an open note can be present in the note list or as a note link
in another open note), and when it is changed, it must be updated in all
places.

Each component will read the note directly from the database:

```typescript
const [{ db }] = useContext(StateContext);
const note = useMemo(() => NotesDB.get(db, id), [db, id]);
```

This leaves the problem of invalidating the cache. We can solve this by
storing a map of note ID/revision in state, updating the revision each
time the note is saved, and using the revision as a dependency in
`useMemo()`:

```typescript
type NoteRevisions = Map<NoteID, NoteRevision>;

const NoteRevisions = {
  increase(revs: NoteRevisions, id: NoteID) {
    const current = revs.get(id) || 0;
    revs.set(id, current + 1);
    return revs;
  },
};

interface State {
  noteRevisions: NoteRevisions;
}

export const saveNote = (state, action) => {
  const { id, value } = action;

  return [
    produce(state, (draft) => {
      NoteRevisions.increase(draft.noteRevisions, id);
    }),
  ];
};
```

We can wrap everything in a `useNote`-hook:

```typescript
const useNote = (id: NoteID) => {
  const [{ db, noteRevisions }] = useContext(StateContext);

  const note = useMemo(() => NotesDB.get(db, id), [
    db,
    id,
    noteRevisions.get(id),
  ]);

  return note;
};
```

### Searching for notes

When searching for notes we have the same issue with cache
invalidation. We want to re-run the search each time any
note changes. To achieve this, we can calculate the sum of
all note revisions, and use that as the cache key for searches:

```typescript
const NoteRevisions = {
  sum(revs: NoteRevisions): number {
    const values = revs.values();

    let value,
      done,
      sum = 0;

    do {
      ({ value, done } = values.next());
      sum += value || 0;
    } while (!done);

    return sum;
  },
};

const useNoteSearch = (query: string) => {
  const [{ db, noteRevisions }] = useContext(StateContext);

  const note = useMemo(() => NotesDB.search(db, query), [
    db,
    query,
    NoteRevisions.sum(noteRevisions),
  ]);
};
```
