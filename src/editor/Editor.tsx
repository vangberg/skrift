import React, { useMemo, useCallback, useState } from 'react';
import { createEditor, Node } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'

import { withNoteLink } from './NoteLink'
import renderElement from './renderElement'

type Props = {
  initialValue: Node[]
}

const Editor: React.FC<Props> = (props) => {
  const editor = useMemo(() => {
    const editor = withReact(withNoteLink(createEditor()))

    return editor
  }, [])

  const [value, setValue] = useState(props.initialValue)

  const onChange = useCallback((value) => {
    setValue(value)
  }, [])

  return (
    <Slate editor={editor} value={value} onChange={onChange}>
      <Editable renderElement={useCallback(renderElement, [])} />
    </Slate>
  );
}

export default Editor;
