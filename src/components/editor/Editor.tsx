import React, { useMemo, useCallback, useEffect, useState } from 'react'
import { Node, createEditor } from 'slate'
import { Slate, Editable, withReact, RenderLeafProps } from 'slate-react'

import { withNoteLink } from './NoteLink'
import { renderElement } from './renderElement'
import { Serializer } from '../../interfaces/serializer';

type Props = {
  markdown: string,
  onUpdate: (markdown: string) => void,
}

const deserialize = (markdown: string) => {
  const nodes = Serializer.deserialize(markdown)

  if (nodes.length > 0) {
    return nodes
  }

  return [{
    type: 'paragraph',
    children: [{ text: '' }]
  }]
}

const renderLeaf = ({ attributes, children, leaf }: RenderLeafProps) => {
  const className = window.skriftDebug ? "border border-green-200" : ""

  return (
    <span {...attributes} className={className}>
      {children}
    </span>
  )
}

export const Editor: React.FC<Props> = ({ markdown, onUpdate }) => {
  const editor =
    useMemo(() => withReact(withNoteLink(createEditor())), [])
  const [value, setValue] =
    useState(() => deserialize(markdown))

  const handleChange = useCallback(((value: Node[]) => {
    setValue(value)
    onUpdate(Serializer.serialize(value))
  }), [onUpdate])

  return (
    <Slate editor={editor} value={value} onChange={handleChange}>
      <pre>{JSON.stringify(value, undefined, 2)}</pre>
      <Editable
        renderElement={renderElement}
        renderLeaf={renderLeaf}
      />
    </Slate>
  );
}