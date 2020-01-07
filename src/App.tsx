import React, { useState, useEffect, useContext, useCallback } from 'react';
import produce from 'immer'
import { StoreContext } from './store';
import { NoteList } from './components/NoteList';
import { NoteEditor } from './components/NoteEditor';

const App: React.FC = () => {
  const store = useContext(StoreContext)
  const [noteIds, setNoteIds] = useState<string[]>(() => store.getIds())
  const [openNoteIds, setOpenNoteIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    store.onUpdate(() => setNoteIds(store.getIds()))
  }, [store])

  const handleSelectNote = useCallback((id: string) => {
    setOpenNoteIds((ids => produce(ids, draft => draft.add(id))))
  }, [])

  return (
    <div>
      <div onClick={() => store.generate()}>Add</div>
      <div onClick={() => {window.localStorage.clear(); window.location.reload()}}>Clear</div>

      <NoteList ids={noteIds} onSelectNote={handleSelectNote} />

      {[...openNoteIds].map(id => <NoteEditor key={id} id={id} />)}
    </div>
  );
}

export default App;
