import produce from 'immer'
import { Note } from "../note"

export type Store = Map<string, Note>

export const Store = {
  getAll(store: Store): IterableIterator<Note> {
    return store.values()
  },

  get(store: Store, id: string): Note | undefined {
    return store.get(id)
  },

  generate(store: Store): Store {
    
  },

  save(store: Store, note: Note): Store {}
}