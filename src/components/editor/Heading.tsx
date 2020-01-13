import React from 'react'
import { RenderElementProps } from 'slate-react'

export const Heading1: React.FC<RenderElementProps> = props => {
  const className = "text-3xl"
  
  return (
    <h1 className={className} {...props.attributes}>
      {props.children}
    </h1>
  )
}

export default { Heading1 }