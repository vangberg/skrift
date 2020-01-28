import { Editor, Range, Point, Transforms, Location } from "slate";

const SHORTCUTS = new Map([["#", { type: "heading", level: 1 }]]);

const rangeBefore = (editor: Editor, point: Point): Location => {
  const block = Editor.above(editor, { match: n => Editor.isBlock(editor, n) });
  const path = block ? block[1] : [];
  const start = Editor.start(editor, path);
  return { anchor: point, focus: start };
};

export const withShortcuts = (editor: Editor): Editor => {
  const { deleteBackward, insertText } = editor;

  editor.insertText = text => {
    const { selection } = editor;

    if (text === " " && selection && Range.isCollapsed(selection)) {
      const range = rangeBefore(editor, selection.anchor);
      const text = Editor.string(editor, range);
      const type = SHORTCUTS.get(text);

      if (type) {
        Transforms.select(editor, range);
        Transforms.delete(editor);
        Transforms.setNodes(editor, type, {
          match: n => Editor.isBlock(editor, n)
        });

        return;
      }
    }

    insertText(text);
  };

  editor.deleteBackward = (...args) => {
    const { selection } = editor;

    if (selection && Range.isCollapsed(selection)) {
      const match = Editor.above(editor, {
        match: n => Editor.isBlock(editor, n)
      });

      if (match) {
        const [block, path] = match;
        const start = Editor.start(editor, path);

        if (
          block.type !== "paragraph" &&
          Point.equals(selection.anchor, start)
        ) {
          Transforms.setNodes(editor, { type: "paragraph" });

          return;
        }
      }
    }

    deleteBackward(...args);
  };

  return editor;
};
