import React, { useState, useEffect } from 'react';
import { Store } from './store';

type Props = {
  store: Store
}

const App: React.FC<Props> = (props) => {
  const { store } = props
  const [ noteIds, setNoteIds ] = useState<string[]>([])

  useEffect(() => {
    console.log(123)
    store.onUpdate(() => setNoteIds(store.getIds()))
  }, [store])

  return (
    <div>
      <div onClick={() => store.generate()}>Add</div>

      {JSON.stringify(noteIds)}
    </div>
  );
}

export default App;
