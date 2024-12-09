import { Plugin } from "prosemirror-state";
import { Decoration, DecorationSet } from "prosemirror-view";
import { NoteWithLinks } from "../../../../skrift/note";

interface NoteLinkPluginState {
  decorationSet: DecorationSet;
  note: NoteWithLinks | null;
}

const isNoteLink = (href: string): boolean => href.indexOf("://") < 0;

// This plugin is responsible for storing the note (and link titles)
// in its state, as well as generating decorations with the note titles
// for links.
export const noteLinkPlugin = new Plugin<NoteLinkPluginState>({
  state: {
    init() {
      return {
        decorationSet: DecorationSet.empty,
        note: null,
      };
    },
    apply(tr, state) {
      // Whenever the note data updates, we apply a transaction with the
      // note as the meta data for this plugin.
      const meta = tr.getMeta(noteLinkPlugin) as NoteWithLinks | undefined;

      // Otherwise, fall back to previously injected note from the state.
      const note = meta || state.note;

      if (!note) {
        return state;
      }

      let set = DecorationSet.empty;
      const decos: Decoration[] = [];

      tr.doc.descendants((node, pos) => {
        const href: string | undefined = node.attrs["href"];

        if (!href) return;
        if (!isNoteLink(href)) return;
        if (node.type.name !== "link") return;

        const link = note!.links.find((link) => link.id === href);
        if (!link) return;

        decos.push(
          Decoration.node(
            pos,
            pos + node.nodeSize,
            {},
            { noteTitle: link.title }
          )
        );
      });

      set = set.add(tr.doc, decos);

      return { note, decorationSet: set };
    },
  },
  props: {
    decorations(state) {
      const pluginState = this.getState(state);
      return pluginState ? pluginState.decorationSet : DecorationSet.empty;
    },
  },
});
