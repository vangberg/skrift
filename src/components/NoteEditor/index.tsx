import React, { useContext, useMemo } from 'react'
import { StoreContext } from '../../store'
import { Editor } from '../Editor'

type Props = {
  id: string
}

export const NoteEditor: React.FC<Props> = ({ id }) => {
  const store = useContext(StoreContext)
  const note = useMemo(() => store.get(id), [id])

  return (
    <div className="border border-gray-500">
      <Editor markdown={note.markdown} />
    </div>
  )
}