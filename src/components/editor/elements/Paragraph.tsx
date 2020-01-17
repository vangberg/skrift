import React from 'react'
import { RenderElementProps } from 'slate-react'

export const Paragraph: React.FC<RenderElementProps> = props => {
  const className = "py-1"
  
  return (
    <p className={className} {...props.attributes}>
      {props.children}
    </p>
  )
}