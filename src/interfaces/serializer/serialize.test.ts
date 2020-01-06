import { serialize } from "./serialize"
import { Node } from "slate"

const value = [
  {
    type: 'heading1',
    children: [{ text: 'A title' }]
  },
  {
    type: 'paragraph',
    children: [
      { text: 'Someone (' },
      {
        type: 'note-link',
        id: '123',
        children: [{ text: '[[123]]' }]
      },
      { text: ') said.'}
    ]
  }
]

describe('slate value', () => {
  it('serializes to markdown', () => {
    const result = serialize(value)

    const expected = `# A title

Someone ([[123]]) said.`

    expect(result).toEqual(expected)
  })
})

export default {}