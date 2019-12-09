import React from 'react';
import { Node } from 'slate'

import { Editor } from './editor'

const initialValue: Node[] = [
  {
    type: 'paragraph',
    children: [
      { text: 'A line of text in a paragraph.' },
      { 
        type: 'note-link',
        id: 123,
        children: [{ text: '' }],
      },
      { text: 'Boo.' },
    ],
  },
]

const App: React.FC = () => {
  return (
    <div>
      <Editor initialValue={initialValue} />
    </div>
  );
}

export default App;
