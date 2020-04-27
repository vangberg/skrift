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

Normally this is handled by placing the notes in the state, and thus any
changes will automatically be propagated. But we are not interested in adding
another layer of caching (the database itself is a cache of the filesystem),
as that requires additional handling of e.g. removing notes from the state
when they are not used anywhere in the UI.

Instead, we will "subscribe" to notes, much like the [Firestore API](https://firebase.google.com/docs/firestore/query-data/listen):

```typescript
const unsubscribe = NotesDB.onNote(db, id, (note) => {});
```

Each time a note is saved via `NotesDB.save()`, the callback function will
be invoked with the new note.

For ease-of-use this can be wrapped in a hook, which will take care of
unsubscribing etc.:

```typescript
const useNote = (id: number) => {
  const [{ db }] = useContext(StateContext);
  const [note, setNote] = useState(() => NotesDB.get(db, id));

  useEffect(() => {
    const unsubscribe = NotesDB.onNote(state.db, id, setNote);
    return unsubscribe;
  });
};

const note = useNote(id);
```

`NotesDB` will need to store a list of subscribers by database and note
ID so we can invoke them when the note is updated.

```typescript
type SubscriberID = number;
type Callback = (note: Note) => void;
type Unsubscribe = () => void;

/*
We need to be able to find:

1. All subscriptions for a given note, when invoking the callbacks.
2. A specific subscription, when unregistering.

Instead of using multiple levels of nested maps, we use an array
of arrays. It makes lookup easy, and we will never have more than
~100 subscriptions at once, so performance should be fine.
*/

type Subscription = [sqlite3.Database, NoteID, SubscriberID, Callback];

const id = 0;
const subscriptions: Subscription[] = [];

const NotesDB = {
  onNote(db: sqlite3.Database, id: NoteID, callback: Callback): Unsubscribe {
    const subId = id++;

    const subscription = [db, id, subId, callback];
    subscriptions.push(subscription);

    return () => {
      const idx = subscriptions.findIndex(
        (s) => s.slice(0, 3) === subscription.slice(0, 3)
      );
      subscriptions.splice(idx, 1);
    };
  },

  save(db: sqlite3.Database, id: NoteID, markdown: Markdown) {
    // … save to SQLite …
    subscriptions
      .find((s) => s.slice(0, 2) === [db, id])
      .forEach(([, callback]) => callback(markdown));
  },
};
```

### Searching for notes
