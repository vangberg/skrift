import React, { useState, useEffect, useContext, useCallback } from 'react';
import produce from 'immer'
import { StoreContext } from './store';
import { NoteList } from './components/NoteList';
import { Editor } from './components/Editor';

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

      {[...openNoteIds].map(id => (
        <Editor key={id} markdown={store.get(id).markdown} />
      ))}
    </div>
  );
}

export default App;
