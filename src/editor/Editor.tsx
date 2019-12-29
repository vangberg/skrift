import React, { useMemo, useCallback, useState } from 'react';
import { createEditor } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'

import { withNoteLink } from './NoteLink'
import renderElement from './renderElement'
import deserialize from './deserialize';

type Props = {
  markdown: string
}

const Editor: React.FC<Props> = (props) => {
  const editor = useMemo(() => {
    const editor = withReact(withNoteLink(createEditor()))

    return editor
  }, [])

  const initialValue = useMemo(() => {
    return deserialize(props.markdown)
  }, [props.markdown])

  const [value, setValue] = useState(initialValue)

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
