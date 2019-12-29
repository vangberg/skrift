import React from 'react';

import { Editor } from './editor'

const markdown = `# En note

A line of text in a
paragraph. [[123]] Boo.`

const App: React.FC = () => {
  return (
    <div>
      <Editor markdown={markdown} />
    </div>
  );
}

export default App;
