import React from 'react'
import { RenderElementProps } from 'slate-react'

export const Heading1: React.FC<RenderElementProps> = props => {
  return (
    <h1 {...props.attributes}>
      {props.children}
    </h1>
  )
}

export default { Heading1 }