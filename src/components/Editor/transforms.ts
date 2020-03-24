import { Transforms, Editor, Node } from "slate";

export const SkriftTransforms = {
  insertParagraph(editor: Editor) {
    const paragraph = { type: "paragraph", children: [{ text: "" }] };
    Transforms.insertNodes(editor, paragraph);
  },

  insertSoftBreak(editor: Editor) {
    Transforms.insertFragment(editor, [{ text: "\n" }]);
  },

  indentListItem(editor: Editor) {
    const { selection } = editor;

    if (!selection) {
      return;
    }

    const block = Editor.above(editor, {
      match: n => Editor.isBlock(editor, n)
    });

    if (!block || block[0].type !== "list-item") {
      return;
    }

    const [node, path] = block;
    const prev = Editor.previous(editor, { at: path });

    // The first item in a list cannot be indented.
    if (!prev || prev[0].type !== "list-item") {
      return;
    }

    // Wrap the list item to be moved in a new list
    const list = { type: "bulleted-list", children: [] };
    Transforms.wrapNodes(editor, list);

    // Wrap the children of the previous list item in a paragrah
    Transforms.wrapNodes(
      editor,
      { type: "paragraph", children: [] },
      { at: prev[1].concat(0) }
    );

    // Move the indented item, now wrapped in a list, to the last
    // position in the list item before it.
    Transforms.moveNodes(editor, {
      at: path,
      to: prev[1].concat(1)
    });
  }
};
