import React from 'react'
import { RenderElementProps } from 'slate-react'

import { NoteLink } from './NoteLink'
import { Heading1 } from './Heading'

const DefaultElement: React.FC<RenderElementProps> = ({ attributes, children }) => {
  const className = window.skriftDebug ? "border border-blue-200" : ""
  return (

    <p {...attributes} className={className}>
      {children}
    </p>
  )
}

export function renderElement(props: RenderElementProps) {
  switch (props.element.type) {
    case 'heading1':
      return <Heading1 {...props} />
    case 'note-link':
      return <NoteLink {...props} />
    default:
      return (
        <DefaultElement {...props} />
      )
  }
}