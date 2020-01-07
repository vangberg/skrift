import React, { useMemo, useCallback, useState } from 'react'
import { Node, createEditor } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'

import { withNoteLink } from './NoteLink'
import { renderElement } from './renderElement'
import { Serializer } from '../../interfaces/serializer';

type Props = {
  markdown: string
}

const initialValue = (markdown: string) => {
  const nodes = Serializer.deserialize(markdown)

  if (nodes.length > 0) {
    return nodes
  }

  return [{
    type: 'paragraph',
    children: [{ text: '' }]
  }]
}

export const Editor: React.FC<Props> = ({ markdown }) => {
  const editor = useMemo(
    () => withReact(withNoteLink(createEditor())),
    []
  )

  const [value, setValue] = useState<Node[]>(() => initialValue(markdown))

  const onChange = useCallback(setValue, [])

  return (
    <Slate editor={editor} value={value} onChange={onChange}>
      <Editable renderElement={useCallback(renderElement, [])} />
    </Slate>
  );
}