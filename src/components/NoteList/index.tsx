import React, { useContext } from 'react'
import { NoteListItem } from './NoteListItem'

type Props = {
  ids: string[]
}

export const NoteList: React.FC<Props> = ({ ids }) => {
  return (
    <ul>
      {ids.map(id => <NoteListItem id={id} />)}
    </ul>
  )
}