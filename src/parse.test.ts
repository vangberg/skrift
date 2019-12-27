import parse from './parse'
import Prism from 'prismjs'

const note = `# Title

Someone ([[123]]) said something:

* First item: [[2]]
* Second item: [[3]]`

it('does', () => {
  console.log(Prism.languages.markdown)
 // const tokenized = Prism.tokenize(note, Prism.languages.markdown)
})

export default null