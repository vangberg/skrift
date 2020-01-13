import { Note } from '.'

const fullNote = `# A title

Some content. [[123]].
Another link: [[456]]`

describe('parseMarkdown', () => {
  describe('with full note', () => {
    const note = Note.fromMarkdown(fullNote)

    it('parses title', () => {
      expect(note.title).toEqual('A title')
    })

    it('parses links', () => {
      expect(note.links).toEqual([
        { id: '123' }, { id: '456' }
      ])
    })

    it('stores markdown', () => {
      expect(note.markdown).toEqual(fullNote)
    })
  })
})

export default {}