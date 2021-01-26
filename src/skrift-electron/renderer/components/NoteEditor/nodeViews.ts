import { EditorProps } from "prosemirror-view";

export const nodeViews = (): EditorProps["nodeViews"] => {
  return {
    // We use a custom node view to render links, so
    // we can enrich note links with their actual title.
    link: (node, view, getPos, decos) => {
      const dom = document.createElement("a");
      dom.setAttribute("href", node.attrs["href"]);

      // The title of the note is injected into ProseMirror
      // by adding it as a spec on an otherwise empty decoration.
      // Using decorations is the only way to force the node to
      // re-render when the note data changes.
      const deco = decos.find((deco) => deco.spec.noteTitle);

      dom.innerText = deco
        ? deco.spec.noteTitle
        : node.content.firstChild!.text;

      return { dom };
    },
  };
};
