import React from 'react'
import { RenderElementProps, DefaultElement } from 'slate-react'

import { NoteLink } from './NoteLink'

const renderElement = (props: RenderElementProps) => {
  switch (props.element.type) {
    case 'note-link':
      return <NoteLink {...props} />
    default:
      return <DefaultElement {...props} />
  }
}

export default renderElement