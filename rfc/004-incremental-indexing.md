# Incremental Indexing

At a later point we want to add note embeddings. This is a resource intensive operation,
and we don't want to compute the embeddings for all notes on every startup. To some extend
the same is true for parsing the notes and adding them to the FTS index.

## Implementation

- Add field `checksum` to `notes` table.
- Add `NotesDB.loadDir` to load notes from the filesystem and add them to the database.
  - If the checksum of a note has changed, save it to the database with `NotesDB.save`.
  - If the note has been deleted, remove it from the database.
  - If the note has been added, add it to the database.
- Use `NotesDB.loadDir` in `ipc.ts` to load notes from the filesystem when the user opens the app.