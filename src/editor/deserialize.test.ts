import deserialize from './deserialize'

describe('heading', () => {
  it('deserializes', () => {
    const result = deserialize('# Heading 1')
    const expected = [{
      type: 'heading1',
      children: [{ text: 'Heading 1'}]
    }]

    expect(result).toEqual(expected)
  })
})

describe('note link', () => {
  it('deserializes', () => {
    const result = deserialize('[[123]]')
    const expected = [{
      type: 'paragraph',
      children: [{
        type: 'note-link',
        id: '123',
        children: [{ text: '[[123]]' }]
      }]
    }]

    expect(result).toEqual(expected)
  })
})

const note = `# A title

Someone ([[123]]) said.`

describe('note', () => {
  it('deserializes', () => {
    const result = deserialize(note)
    const expected = [
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

    expect(result).toEqual(expected)
  })
})

export default {}