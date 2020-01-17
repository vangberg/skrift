import { Transforms, Editor, Location } from 'slate'

export const SkriftTransforms = {
  ...Transforms,
  
  insertParagraph(
    editor: Editor,
    options: { at?: Location, select?: boolean }
  ) {
    const paragraph = { type: 'paragraph', children: [{ text: '' }]}
    Transforms.insertNodes(editor, paragraph, options)
  },

  insertSoftBreak(editor: Editor) {
    Transforms.insertFragment(editor, [{ text: '\n' }])
  },
}