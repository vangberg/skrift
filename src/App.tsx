import React, {
  useMemo,
  useCallback,
  useState
} from 'react';

import {
  createEditor,
  Node,
  Range
} from 'slate'

import {
  Slate,
  Editable,
  RenderElementProps,
  withReact,
  DefaultElement
} from 'slate-react'

import NoteLink from './NoteLink'

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

  const [value, setValue] = useState(initialValue)
  const [selection, setSelection] =
    useState<Range | null>(null)


  return (
    <div>
      <Slate
        editor={editor}
        value={value}
        selection={selection}
        onChange={(value, selection) => {
          setValue(value)
          setSelection(selection)
        }}
      >
        <Editable
          renderElement={renderElement}
        />
      </Slate>
    </div>
  );
}

export default App;
