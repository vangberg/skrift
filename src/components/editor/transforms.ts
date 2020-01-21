import { Transforms, Editor, Location } from 'slate'

export const SkriftTransforms = {
  insertParagraph(editor: Editor) {
    const paragraph = { type: 'paragraph', children: [{ text: '' }]}
    Transforms.insertNodes(editor, paragraph)
  },

  insertSoftBreak(editor: Editor) {
    Transforms.insertFragment(editor, [{ text: '\n' }])
  },
}