import { Editor, Node, Transforms, Descendant, Element } from "slate";

const handleInsertBreak = (editor: Editor): boolean => {
  // When inserting a break in an empty list item, break out of the list
  // and insert a new paragraph.
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
    return true;
  }

  return false;
};
export const withList = (editor: Editor): Editor => {
  const { normalizeNode } = editor;

  editor.normalizeNode = entry => {
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
            if (
              prev[0].type === "bulleted-list" &&
              child.type === "bulleted-list"
            ) {
              Transforms.mergeNodes(editor, { at: childPath });
              return;
            }
          }
        }
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
