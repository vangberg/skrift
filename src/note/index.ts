import { Node } from 'slate'
import { Serializer } from '../serializer'
import { parse } from './parse'

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
  parse
}