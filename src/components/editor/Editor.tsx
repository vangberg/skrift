import React, { useMemo, useCallback, useEffect, useState } from 'react'
import { Editor, Node, createEditor } from 'slate'
import { Slate, Editable, withReact, RenderLeafProps } from 'slate-react'

import { withNoteLink } from './withNoteLink'
import { renderElement } from './renderElement'
import { Serializer } from '../../interfaces/serializer';
import { withHeading } from './withHeading'
import { isHotkey } from 'is-hotkey'
import { SkriftTransforms } from './transforms'
import { withShortcuts } from './withShortcuts'

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

const PLUGINS = [withNoteLink, withHeading, withShortcuts]

type Plugin = (editor: Editor) => Editor

const withPlugins = (editor: Editor, plugins: Plugin[]) => {
  return plugins
    .reverse()
    .reduce((currentEditor, plugin) => plugin(currentEditor), editor)
}

export const SkriftEditor: React.FC<Props> = ({ markdown, onUpdate }) => {
  const editor = useMemo(() => (
    withReact(withPlugins(createEditor(), PLUGINS))
  ), [])
  const [value, setValue] = useState(() => deserialize(markdown))

  const handleChange = useCallback(((value: Node[]) => {
    setValue(value)
    onUpdate(Serializer.serialize(value))
  }), [onUpdate])

  return (
    <Slate editor={editor} value={value} onChange={handleChange}>
      <Editable
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        onKeyDown={event => {
          const { nativeEvent } = event
          if (isHotkey('shift+enter')(nativeEvent)) {
            event.preventDefault()
            SkriftTransforms.insertSoftBreak(editor)
          }
        }}
      />
      {window.skriftDebug && 
        <pre className="text-xs">{JSON.stringify(value, undefined, 2)}</pre>
      }
    </Slate>
  );
}