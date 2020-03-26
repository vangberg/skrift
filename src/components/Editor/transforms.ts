import { Transforms, Editor, Node, Path, Text } from "slate";
import { hyperprint } from "../../testSupport";

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

    Editor.withoutNormalizing(editor, () => {
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
    });
  },

  unindentListItem(editor: Editor) {
    const { selection } = editor;

    if (!selection) {
      return;
    }

    // If the current block is not a list item, don't do anything.
    const block = Editor.above(editor, {
      match: n => Editor.isBlock(editor, n)
    });
    if (!block || block[0].type !== "list-item") {
      return;
    }
    const [item, itemPath] = block;

    // Find the list for the current list item.
    const listBlock = Editor.above(editor, {
      match: n => Editor.isBlock(editor, n) && n.type === "bulleted-list"
    });
    if (!listBlock) {
      return;
    }
    const [list, listPath] = listBlock;

    // If the list is not a nested list, ie. its parent block is not a list
    // item, don't do anything.
    const parentItemBlock = Editor.above(editor, {
      at: listPath,
      match: n => Editor.isBlock(editor, n)
    });
    if (!parentItemBlock || parentItemBlock[0].type !== "list-item") {
      return;
    }
    const [, parentItemPath] = parentItemBlock;

    const itemRef = Editor.pathRef(editor, itemPath);

    Editor.withoutNormalizing(editor, () => {
      if (item.children.length === 1 && Text.isText(item.children[0])) {
        Transforms.wrapNodes(
          editor,
          { type: "paragraph", children: [] },
          { at: itemRef.current!.concat(0) }
        );
      }

      Transforms.liftNodes(editor, {
        at: itemRef.current!
      });

      const moveTo = itemRef.current!.concat(item.children.length);

      const [parentItem] = Editor.node(editor, parentItemPath);

      const following = parentItem.children.slice(
        Path.relative(itemRef.current!, parentItemPath)[0] + 1
      );
      Transforms.insertNodes(editor, following, { at: moveTo });

      for (const [, childPath] of Node.children(editor, parentItemPath, {
        reverse: true
      })) {
        if (Path.isAfter(childPath, itemRef.current!)) {
          Transforms.removeNodes(editor, { at: childPath });
        }
      }

      Transforms.liftNodes(editor, {
        at: itemRef.current!
      });
    });

    itemRef.unref();
  }
};
