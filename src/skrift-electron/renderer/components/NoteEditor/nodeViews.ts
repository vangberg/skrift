import { EditorProps } from "prosemirror-view";

const isNoteLink = (href: string): boolean => href.indexOf("://") < 0;

export const nodeViews = (): EditorProps["nodeViews"] => {
  return {
    // We use a custom node view to render links, so
    // we can enrich note links with their actual title.
    link: (node, view, getPos, decos) => {
      const dom = document.createElement("a");
      const href = node.attrs["href"];
      dom.setAttribute("href", node.attrs["href"]);
      dom.innerText = node.content.firstChild!.text || "";

      // The title of the note is injected into ProseMirror
      // by adding it as a spec on an otherwise empty decoration.
      // Using decorations is the only way to force the node to
      // re-render when the note data changes.
      const deco = decos.find((deco) => deco.spec.noteTitle);

      if (isNoteLink(href)) {
        // We know this note.
        if (deco?.spec.noteTitle) {
          dom.innerText = deco.spec.noteTitle;
          dom.classList.add("known");
        } else {
          dom.classList.add("unknown");
        }
      } else {
        dom.classList.add("external");
      }

      return { dom };
    },
  };
};
