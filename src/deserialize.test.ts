import { parseMarkdown, md } from './deserialize'
import { logo } from './utils'

const note = `# A title

Someone ([[123]]) said:

* Something [[4]]
* And [[5]]`

it('parses', () => {
  const res = md.parse(note, {})
  logo(res)
})

export default {}