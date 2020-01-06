import React, { useContext, useMemo } from 'react'
import { StoreContext } from '../../store'

type Props = {
  id: string
}

export const NoteListItem: React.FC<Props> = ({ id }) => {
  const store = useContext(StoreContext)
  const note = useMemo(() => store.get(id), [id, store])

  return <li>{note.title || id}</li>
}