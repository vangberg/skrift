import React from 'react'
import { RenderElementProps } from 'slate-react'
import { Editor } from 'slate'

export const NoteLink: React.FC<RenderElementProps> = props => {
  return (
    <span {...props.attributes}>
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

  return editor
}


export default { NoteLink, withNoteLink }