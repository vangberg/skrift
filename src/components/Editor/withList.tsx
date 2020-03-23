import { Editor, Node, Transforms, Descendant, Element } from "slate";

const isList = (node: Node) =>
  ["bulleted-list", "numbered-list"].includes(node.type);

export const withList = (editor: Editor): Editor => {
  const { normalizeNode } = editor;

  editor.normalizeNode = entry => {
    const [node, path] = entry;

    if (Element.isElement(node)) {
      const prev = Editor.previous(editor, { at: path });

      if (prev && Element.isElement(prev[0])) {
        if (prev[0].type === "bulleted-list" && node.type === "bulleted-list") {
          Transforms.mergeNodes(editor, { at: path });
          return;
        }
      }

      const next = Editor.next(editor, { at: path });

      if (next && Element.isElement(next[0])) {
        if (next[0].type === "bulleted-list" && node.type === "bulleted-list") {
          Transforms.mergeNodes(editor, { at: next[1] });
          return;
        }
      }
    }

    normalizeNode(entry);
  };

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
        match: isList,
        split: true
      });
      return;
    }

    insertBreak();
  };

  return editor;
};
