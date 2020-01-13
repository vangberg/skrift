import React from 'react'
import { RenderElementProps } from 'slate-react'
import { Editor, Transforms, Text, Path, Node } from 'slate'
import { Serializer } from '../../interfaces/serializer'

export const NoteLink: React.FC<RenderElementProps> = props => {
  const className = "border-b-4 border-orange-400"

  return (
    <span {...props.attributes} className={className}>
      <a href="http://google.com">
        {props.element.id}
      </a>
      {props.children}
    </span>
  )
}

export const withNoteLink = (editor: Editor): Editor => {
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

  const { insertText } = editor

  editor.insertText = text => {
    insertText(text)

    if (text !== "]" || !editor.selection) { return }

    const { anchor } = editor.selection
    const [leaf, leafPath] = Editor.leaf(editor, anchor)
    const nodes = Serializer.deserializeInline(leaf.text)

    const link = nodes.find(n => Node.matches(n, { type: 'note-link'}))
    if (!link) { return }

    // Select the whole leaf.
    Transforms.select(editor, leafPath)
    // Insert new nodes in place of selected leaf.
    Transforms.insertNodes(editor, nodes, { select: true })
    // Move into note link
    Transforms.move(editor)
    // Move past note link
    Transforms.move(editor)
  }

  const { insertNode } = editor

  return editor
}


export default { NoteLink, withNoteLink }