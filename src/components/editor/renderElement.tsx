import React from 'react'
import { RenderElementProps, DefaultElement } from 'slate-react'

import { NoteLink } from './NoteLink'
import { Heading1 } from './Heading'

export function renderElement(props: RenderElementProps) {
  switch (props.element.type) {
    case 'heading1':
      return <Heading1 {...props} />
    case 'note-link':
      return <NoteLink {...props} />
    default:
      return <DefaultElement {...props} />
  }
}