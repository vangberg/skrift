import React, { useMemo, useCallback, useState } from 'react';
import { createEditor, Node, Range } from 'slate'
import { Slate, Editable, RenderElementProps, withReact } from 'slate-react'

import { withNoteLink } from './NoteLink'
import renderElement from './renderElement'

type Props = {
  initialValue: Node[]
}

const Editor: React.FC<Props> = (props) => {
  const editor = useMemo(() => {
    const editor = withNoteLink(withReact(createEditor()))

    const { exec } = editor

    editor.exec = command => {
      console.log(command, editor.selection)
      exec(command)
    } 

    return editor
  }, [])

  const [value, setValue] = useState(props.initialValue)

  const [selection, setSelection] = useState<Range | null>(null)

  const onChange = useCallback((value, selection) => {
    setValue(value)
    setSelection(selection)
  }, [])

  return (
    <Slate editor={editor} value={value} selection={selection} onChange={onChange}>
      <Editable renderElement={useCallback(renderElement, [])} />
    </Slate>
  );
}

export default Editor;
