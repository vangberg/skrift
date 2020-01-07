import React, { useContext, useMemo, useCallback } from 'react'
import { StoreContext } from '../../store'

type Props = {
  id: string,
  onClick?: (() => void)
}

export const NoteListItem: React.FC<Props> = ({ id, onClick }) => {
  const store = useContext(StoreContext)
  const note = useMemo(() => store.get(id), [id, store])

  const handleClick = useCallback(() => {
    if (onClick) { onClick() }
  }, [onClick])

  return <li onClick={handleClick}>{note.title || id}</li>
}