import { Editor, Range, Point, Transforms, Location } from "slate";

const SHORTCUTS = new Map([
  ["#", { type: "heading", level: 1 }],
  ["##", { type: "heading", level: 2 }],
  ["###", { type: "heading", level: 3 }],
  ["*", { type: "list-item" }],
  ["-", { type: "list-item" }],
]);

const rangeBefore = (editor: Editor, point: Point): Location => {
  const block = Editor.above(editor, {
    match: (n) => Editor.isBlock(editor, n),
  });
  const path = block ? block[1] : [];
  const start = Editor.start(editor, path);
  return { anchor: point, focus: start };
};

const handleInsert = (editor: Editor, text: string): boolean => {
  const { selection } = editor;

  if (text !== " " || !selection || !Range.isCollapsed(selection)) {
    return false;
  }

  const block = Editor.above(editor, {
    match: (n) => Editor.isBlock(editor, n),
  });
  if (block && block[0].type !== "paragraph") {
    return false;
  }

  const range = rangeBefore(editor, selection.anchor);
  const shortcut = Editor.string(editor, range);
  const shortcutProps = SHORTCUTS.get(shortcut);

  if (!shortcutProps) {
    return false;
  }

  Editor.withoutNormalizing(editor, () => {
    Transforms.select(editor, range);
    Transforms.delete(editor);

    Transforms.setNodes(editor, shortcutProps, {
      match: (n) => Editor.isBlock(editor, n),
    });

    if (shortcutProps.type === "list-item") {
      const list = { type: "bulleted-list", children: [] };
      Transforms.wrapNodes(editor, list, {
        match: (n) => n.type === "list-item",
      });
    }
  });

  return true;
};

const handleDelete = (editor: Editor): boolean => {
  const { selection } = editor;

  if (!selection) {
    return false;
  }

  if (!Range.isCollapsed(selection)) {
    return false;
  }

  const parent = Editor.above(editor, {
    match: (n) => Editor.isBlock(editor, n),
  });

  if (!parent) {
    return false;
  }

  const [block, path] = parent;
  const start = Editor.start(editor, path);

  if (block.type === "paragraph" || !Point.equals(selection.anchor, start)) {
    return false;
  }

  Transforms.setNodes(editor, {
    type: "paragraph",
    level: undefined,
  });

  if (block.type === "list-item") {
    Transforms.unwrapNodes(editor, {
      match: (n) => ["bulleted-list", "numbered-list"].includes(n.type),
      split: true,
    });
  }

  return true;
};

export const withShortcuts = (editor: Editor): Editor => {
  const { deleteBackward, insertText } = editor;

  editor.insertText = (text) => {
    handleInsert(editor, text) || insertText(text);
  };

  editor.deleteBackward = (...args) => {
    handleDelete(editor) || deleteBackward(...args);
  };

  return editor;
};
