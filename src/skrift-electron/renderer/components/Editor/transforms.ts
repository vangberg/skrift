import { Transforms, Element, Editor, Node, Path, Text } from "slate";
import { hyperprint } from "../../../../testSupport";

const isList = (node: Node) =>
  ["bulleted-list", "numbered-list"].includes(node.type);

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
      match: (n) => n.type === "list-item",
    });
    if (!block) {
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
      const currentList = Editor.above(editor, {
        match: (n) => isList(n),
      });
      if (!currentList) {
        return;
      }
      const list = { type: currentList[0].type, children: [] };
      Transforms.wrapNodes(editor, list, { at: path });

      /*
      If the previous item only has inline children, we need to wrap them in a
      paragraph, so we can add the indented item to it.
      */
      if (Element.isElement(prev[0]) && Editor.hasInlines(editor, prev[0])) {
        Transforms.setNodes(editor, { type: "paragraph" }, { at: prev[1] });
        Transforms.wrapNodes(
          editor,
          { type: "list-item", children: [] },
          { at: prev[1] }
        );
      }

      // Move the indented item, now wrapped in a list, to the last
      // position in the list item before it.
      Transforms.moveNodes(editor, {
        at: path,
        to: prev[1].concat(Node.get(editor, prev[1]).children.length),
      });
    });
  },

  unindentListItem(editor: Editor) {
    const { selection } = editor;

    if (!selection) {
      return;
    }

    // If the current block is not in a list item, don't do anything.
    const block = Editor.above(editor, {
      match: (n) => n.type === "list-item",
    });
    if (!block) {
      return;
    }
    const [item, itemPath] = block;

    // Find the list for the current list item.
    const listBlock = Editor.above(editor, {
      match: (n) => Editor.isBlock(editor, n) && n.type === "bulleted-list",
    });
    if (!listBlock) {
      return;
    }
    const [list, listPath] = listBlock;

    // If the list is not a nested list, ie. its parent block is not a list
    // item, don't do anything.
    const parentItemBlock = Editor.above(editor, {
      at: listPath,
      match: (n) => Editor.isBlock(editor, n),
    });
    if (!parentItemBlock || parentItemBlock[0].type !== "list-item") {
      return;
    }
    const [, parentItemPath] = parentItemBlock;

    const itemRef = Editor.pathRef(editor, itemPath);

    Editor.withoutNormalizing(editor, () => {
      // If the item only has text children, we need to wrap them in a paragraph,
      // so we can add the following siblings to the item.
      if (item.children.length === 1 && Text.isText(item.children[0])) {
        Transforms.wrapNodes(
          editor,
          { type: "paragraph", children: [] },
          { at: itemRef.current!.concat(0) }
        );
      }

      // Move the list item out of the list, splitting the list as a result.
      Transforms.liftNodes(editor, {
        at: itemRef.current!,
      });

      // The parent item has probably changed, so we fetch it again.
      const [parentItem] = Editor.node(editor, parentItemPath);

      // All children in the parent item that comes after the item we
      // are unindenting, including both following list items as well as
      // other block nodes, will be moved into the item that we are unindenting.

      // Find all nodes that come after the item.
      const following = parentItem.children.slice(
        Path.relative(itemRef.current!, parentItemPath)[0] + 1
      );

      // Insert the following nodes as children of the item.
      const moveTo = itemRef.current!.concat(item.children.length);
      Transforms.insertNodes(editor, following, { at: moveTo });

      // Remove all the following nodes from their original location.
      for (const [, childPath] of Node.children(editor, parentItemPath, {
        reverse: true,
      })) {
        if (Path.isAfter(childPath, itemRef.current!)) {
          Transforms.removeNodes(editor, { at: childPath });
        }
      }

      // Lift the item out into the parent list
      Transforms.liftNodes(editor, {
        at: itemRef.current!,
      });
    });

    itemRef.unref();
  },
};
