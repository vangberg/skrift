import { Serializer } from './serializer'

export interface Note {
  title: string,
  links: NoteLink[],
  backlinks: NoteLink[],
  markdown: string
}

export interface NoteLink {
  id: string
}

export const Note = {
  parse(markdown: string): Note {
    const parsed = Serializer.deserialize(markdown)
    
  }
}