import Remarkable from 'remarkable'
import noteLink from './index'

describe('note-link', () => {
  fit('tokenizes', () => {
    const md = new Remarkable()
    md.inline.ruler.push("note-link", noteLink, {})
    const result = md.parseInline("[[abc]]", {})

    expect(result.length).toEqual(1)

    const token: Remarkable.BlockContentToken = result[0]

    const expected = [
      { type: 'note_link_open', level: 0 },
      { type: 'text', content: 'abc', level: 1 },
      { type: 'note_link_close', level: 0 },
    ]

    expect(token.children).toEqual(expected)
  })
})

export default null