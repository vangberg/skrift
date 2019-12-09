import React from 'react'
import { RenderElementProps } from 'slate-react'

const NoteLink: React.FC<RenderElementProps> = props => {
  return (
    <span {...props.attributes}>
      <a href="http://google.com">
        {props.element.id}
      </a>
      {props.children}
    </span>
  )
}

export default NoteLink