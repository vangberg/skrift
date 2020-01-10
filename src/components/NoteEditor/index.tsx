import React, { useContext, useMemo, useCallback } from 'react'
import { StoreContext } from '../../store'
import { Editor } from '../Editor'

type Props = {
  id: string,
  onUpdate: (id: string, markdown: string) => void,
}

export const NoteEditor: React.FC<Props> = ({ id, onUpdate }) => {
  const store = useContext(StoreContext)
  const note = useMemo(() => store.get(id), [store, id])

  const handleUpdate =
    useCallback((markdown: string) => onUpdate(id, markdown), [id, onUpdate])

  return (
    <div className="border border-gray-500">
      <Editor markdown={note.markdown} onUpdate={handleUpdate} />
    </div>
  )
}