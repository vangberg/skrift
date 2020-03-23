import { Editor, Range, Point, Transforms, Location } from "slate";

const SHORTCUTS = new Map([
  ["#", { type: "heading", level: 1 }],
  ["##", { type: "heading", level: 2 }],
  ["###", { type: "heading", level: 3 }],
  ["*", { type: "list-item" }],
  ["-", { type: "list-item" }]
]);

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
      const shortcut = SHORTCUTS.get(text);

      if (shortcut) {
        Transforms.select(editor, range);
        Transforms.delete(editor);
        Transforms.setNodes(editor, shortcut, {
          match: n => Editor.isBlock(editor, n)
        });

        if (shortcut.type === "list-item") {
          const list = { type: "bulleted-list", children: [] };
          Transforms.wrapNodes(editor, list, {
            match: n => n.type === "list-item"
          });
        }

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
          Transforms.setNodes(editor, {
            type: "paragraph",
            level: undefined
          });

          return;
        }
      }
    }

    deleteBackward(...args);
  };

  return editor;
};
