import { Editor, Range, Transforms } from "slate";

export const withList = (editor: Editor): Editor => {
  const { insertBreak } = editor;

  editor.insertBreak = () => {
    const block = Editor.above(editor, {
      match: n => Editor.isBlock(editor, n)
    });

    if (!block || block[0].type !== "list-item") {
      return false;
    }

    if (Editor.isEmpty(editor, block[0])) {
      Transforms.setNodes(editor, {
        type: "paragraph"
      });

      Transforms.unwrapNodes(editor, {
        match: n => ["bulleted-list", "numbered-list"].includes(n.type),
        split: true
      });
      return;
    }

    insertBreak();
  };

  return editor;
};
