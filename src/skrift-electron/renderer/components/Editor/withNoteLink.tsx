import { Editor, Transforms, Node } from "slate";
import { Serializer } from "../../../../skrift/serializer";
import {} from "slate-react";

export const withNoteLink = (editor: Editor): Editor => {
  const { isInline } = editor;

  editor.isInline = (element) => {
    switch (element.type) {
      case "note-link":
        return true;
      default:
        return isInline(element);
    }
  };

  const { isVoid } = editor;

  editor.isVoid = (element) => {
    switch (element.type) {
      case "note-link":
        return true;
      default:
        return isVoid(element);
    }
  };

  const { insertText } = editor;

  editor.insertText = (text) => {
    insertText(text);

    if (text !== "]" || !editor.selection) {
      return;
    }

    const { anchor } = editor.selection;
    const [leaf, leafPath] = Editor.leaf(editor, anchor);
    const nodes = Serializer.deserializeInline(leaf.text);

    const link = nodes.find((n) => Node.matches(n, { type: "note-link" }));
    if (!link) {
      return;
    }

    // Select the whole leaf.
    Transforms.select(editor, leafPath);
    // Insert new nodes in place of selected leaf.
    Transforms.insertNodes(editor, nodes, { select: true });
    // Move into note link
    Transforms.move(editor);
    // Move out of note link
    Transforms.move(editor);
  };

  return editor;
};
