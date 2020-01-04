import React, { useState } from 'react';
import { useNotes } from './useNotes';

const App: React.FC = () => {
  const { notes, setNote } = useNotes()
  const [ openNotes, setOpenNotes ] = useState([])

  return (
    <div>
      <div onClick></div>
      {JSON.stringify(notes)}
      {JSON.stringify(openNotes)}
    </div>
  );
}

export default App;
