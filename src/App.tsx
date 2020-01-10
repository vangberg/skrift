import React, { useState, useEffect, useContext, useCallback } from 'react';
import produce from 'immer'
import { StoreContext } from './store';
import { NoteList } from './components/NoteList';
import { NoteEditor } from './components/NoteEditor';
import { Note } from './interfaces/note';

const App: React.FC = () => {
  const store = useContext(StoreContext)
  const [noteIds, setNoteIds] = useState(() => store.getIds())
  const [openNoteIds, setOpenNoteIds] =
    useState(() => new Set(store.getIds().slice(0, 1)))

  useEffect(() => {
    store.onUpdate(() => setNoteIds(store.getIds()))
  }, [store])

  const handleSelectNote = useCallback((id: string) => {
    setOpenNoteIds((ids => produce(ids, draft => draft.add(id))))
  }, [])
  const handleUpdateNote = useCallback((id: string, markdown: string) => {
    store.save(id, Note.fromMarkdown(markdown))
  }, [store])

  return (
    <div>
      <div onClick={() => store.generate()}>Add</div>
      <div onClick={() => {window.localStorage.clear(); window.location.reload()}}>Clear</div>

      <NoteList ids={noteIds} onSelectNote={handleSelectNote} />

      {[...openNoteIds].map(id => (
        <NoteEditor key={id} id={id} onUpdate={handleUpdateNote} />
      ))}
    </div>
  );
}

export default App;
