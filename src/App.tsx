import React, { useMemo, useCallback } from 'react';

import { createEditor, Node } from 'slate'
import { Slate, Editable, RenderElementProps, withReact, DefaultElement } from 'slate-react'

import NoteLink from './NoteLink'

const defaultValue: Node[] = [
  {
    type: 'paragraph',
    children: [
      {
        text: 'A line of text in a paragraph.',
        marks: [],
      },
      { 
        type: 'note-link',
        id: 123,
        children: [
          {
            text: '',
            marks: [],
          },
        ],
      },
      {
        text: 'Boo.',
        marks: [],
      },
    ],
  },
]

const App: React.FC = () => {
  const editor = useMemo(() => {
    const editor = withReact(createEditor())

    const { isInline } = editor

    editor.isInline = element => {
      switch (element.type) {
        case 'note-link':
          return true
        default:
          return isInline(element)
      }
    }

    const { isVoid } = editor

    editor.isVoid = element => {
      switch (element.type) {
        case 'note-link':
          return true
        default:
          return isVoid(element)
      }
    }

    return editor
  }, [])

  const renderElement = useCallback((props: RenderElementProps) => {
    switch (props.element.type) {
      case 'note-link':
        return <NoteLink {...props} />
      default:
        return <DefaultElement {...props} />
    }
  }, [])

  return (
    <div>
      <Slate editor={editor} defaultValue={defaultValue}>
        <Editable
          renderElement={renderElement}
        />
      </Slate>
    </div>
  );
}

export default App;
