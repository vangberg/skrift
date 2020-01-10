import React, { useMemo, useCallback, useEffect, useState } from 'react'
import { Node, createEditor } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'

import { withNoteLink } from './NoteLink'
import { renderElement } from './renderElement'
import { Serializer } from '../../interfaces/serializer';

type Props = {
  markdown: string,
  onUpdate: (markdown: string) => void,
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

export const Editor: React.FC<Props> = ({ markdown, onUpdate }) => {
  useEffect(() => {
    console.log({ markdown })
  }, [markdown])
  const editor =
    useMemo(() => withReact(withNoteLink(createEditor())), [])
  const [value, setValue] =
    useState(() => initialValue(markdown))

  const handleChange = useCallback(((value: Node[]) => {
    console.log({ value })
    setValue(value)
    onUpdate(Serializer.serialize(value))
  }), [onUpdate])

  return (
    <Slate editor={editor} value={value} onChange={handleChange}>
      <Editable renderElement={useCallback(renderElement, [])} />
    </Slate>
  );
}