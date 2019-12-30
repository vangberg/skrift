export interface Note {
  title: string,
  links: NoteLink[],
  backlinks: NoteLink[],
  markdown: string
}

export interface NoteLink {
  id: string
}