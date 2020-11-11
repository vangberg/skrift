import { Editor, Node, Transforms, Descendant, Element } from "slate";
import { SkriftTransforms } from "./transforms";
import { hyperprint } from "../../../../testSupport";

const isList = (node: Node) =>
  ["bulleted-list", "numbered-list"].includes(node.type);

const areListsOfSameType = (a: Node, b: Node) => isList(a) && a.type === b.type;

const handleInsertBreak = (editor: Editor): boolean => {
  // When inserting a break in an empty list item, break out of the list
  // and insert a new paragraph.
  const block = Editor.above(editor, {
    match: (n) => Editor.isBlock(editor, n),
  });
  if (!block || block[0].type !== "list-item") {
    return false;
  }
  const [item, itemPath] = block;

  const list = Editor.above(editor, {
    match: (n) => isList(n),
  });
  if (!list) {
    return false;
  }

  if (Editor.isEmpty(editor, item)) {
    // Check whether this is a nested list or not
    const parentItem = Editor.above(editor, {
      at: list[1],
      match: (n) => n.type === "list-item",
    });

    if (parentItem) {
      // It is a nested list, so we unindent the current item
      SkriftTransforms.unindentListItem(editor);
    } else {
      // It is a top level list, so we turn the item into a paragrah
      // and lift it out of the list.

      Transforms.setNodes(editor, {
        type: "paragraph",
      });

      Transforms.unwrapNodes(editor, {
        match: (n) => isList(n),
        split: true,
      });
    }
    return true;
  }

  return false;
};

export const withList = (editor: Editor): Editor => {
  const { normalizeNode } = editor;

  editor.normalizeNode = (entry) => {
    const [node, path] = entry;

    // If list item contains a single paragraph, unwrap the children.
    if (
      Element.isElement(node) &&
      node.type === "list-item" &&
      node.children.length === 1
    ) {
      const child = node.children[0];
      if (Element.isElement(child) && child.type === "paragraph") {
        Transforms.unwrapNodes(editor, { at: path.concat(0) });
        return;
      }
    }

    // Merge adjacent lists
    if (Editor.isEditor(node) || Element.isElement(node)) {
      for (const [child, childPath] of Node.children(editor, path)) {
        if (Element.isElement(child)) {
          const prev = Editor.previous(editor, { at: childPath });
          if (prev && Element.isElement(prev[0])) {
            if (areListsOfSameType(prev[0], child)) {
              Transforms.mergeNodes(editor, { at: childPath });
              return;
            }
          }
        }
      }
    }

    // Insert empty paragraph in list item with nested list, if missing.
    if (
      Element.isElement(node) &&
      node.type === "list-item" &&
      node.children.length > 0 &&
      isList(node.children[0])
    ) {
      Transforms.insertNodes(
        editor,
        [{ type: "paragraph", children: [{ text: "" }] }],
        {
          at: path.concat(0),
        }
      );
      return;
    }

    // Wrap orphaned list items in bulleted list
    if (Element.isElement(node) && node.type === "list-item") {
      const above = Editor.above(editor, { at: path });

      if (!above || !isList(above[0])) {
        Transforms.wrapNodes(
          editor,
          {
            type: "bulleted-list",
            children: [],
          },
          { at: path }
        );
        return;
      }
    }

    normalizeNode(entry);
  };

  const { insertBreak } = editor;

  editor.insertBreak = () => {
    handleInsertBreak(editor) || insertBreak();
  };

  return editor;
};
