import createPersistedState from 'use-persisted-state'
import produce from 'immer'
import { Note } from './note'

type Notes = Map<string, Note>

const useNotesState = createPersistedState('skrift.notes')

export function useNotes() {
  const [notes, setNotes] = useNotesState(new Map())

  return {
    notes,
    setNote: (id: string, note: Note) => {
      setNotes(currentNotes => produce(currentNotes, draftNotes => {
        draftNotes.set(id, note)
      }))
    }
  }
}
