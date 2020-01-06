import React, { useState, useEffect, useContext } from 'react';
import { StoreContext } from './storeContext';

const App: React.FC = () => {
  const store = useContext(StoreContext)
  const [ noteIds, setNoteIds ] = useState<string[]>(() => store.getIds())

  useEffect(() => {
    store.onUpdate(() => setNoteIds(store.getIds()))
  }, [store])

  return (
    <div>
      <div onClick={() => store.generate()}>Add</div>
      <div onClick={() => {window.localStorage.clear(); window.location.reload()}}>Clear</div>

      {JSON.stringify(noteIds)}
    </div>
  );
}

export default App;
