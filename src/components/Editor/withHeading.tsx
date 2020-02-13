import { Editor, Range } from "slate";
import { SkriftTransforms } from "./transforms";
import { ReactEditor } from "slate-react";

const isEndOfHeading = (editor: ReactEditor, selection: Range) => {
  const block = Editor.above(editor, {
    match: n => Editor.isBlock(editor, n)
  });

  if (!block || block[0].type !== "heading") {
    return false;
  }

  return Editor.isEnd(editor, selection.focus, block[1]);
};

export const withHeading = (editor: ReactEditor): ReactEditor => {
  const { insertBreak } = editor;

  editor.insertBreak = () => {
    const { selection } = editor;

    if (selection && isEndOfHeading(editor, selection)) {
      SkriftTransforms.insertParagraph(editor);
      return;
    }

    insertBreak();
  };

  return editor;
};
