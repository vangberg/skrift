import { Editor } from 'slate'
import { SkriftTransforms } from './transforms'

export const withHeading = (editor: Editor): Editor => {
  const { insertBreak } = editor

  editor.insertBreak = () => {
    const block = Editor.above(editor, {
      match: n => Editor.isBlock(editor, n)
    })

    if (block && block[0].type === 'heading' && editor.selection) {
      SkriftTransforms.insertParagraph(editor)
      return
    }

    insertBreak()
  }

  return editor
}