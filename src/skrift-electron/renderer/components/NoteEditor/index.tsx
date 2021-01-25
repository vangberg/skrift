import "prosemirror-view/style/prosemirror.css";

import React, {
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { NoteID, NoteWithLinks } from "../../../../skrift/note";
import { OpenCardMode } from "../../interfaces/state";
import { Handle, ProseMirror, useProseMirror } from "use-prosemirror";
import { keymap } from "prosemirror-keymap";
import { buildKeymap } from "./keymap";
import { history } from "prosemirror-history";
import {
  Decoration,
  DecorationSet,
  EditorProps,
  EditorView,
} from "prosemirror-view";
import { markdownParser, schema } from "../../../../skrift-markdown/parser";
import { EditorState, Plugin } from "prosemirror-state";
import { markdownSerializer } from "../../../../skrift-markdown/serializer";
import { mouseEventToMode } from "../../mouseEventToMode";

interface Props {
  note: NoteWithLinks;
  onOpen: (id: string, mode: OpenCardMode) => void;
  onUpdate: (markdown: string) => void;
}

const isNoteLink = (href: string): boolean => href.indexOf("://") < 0;

const getNoteID = (target: EventTarget): NoteID | false => {
  if (!(target instanceof HTMLAnchorElement)) {
    return false;
  }

  // HTMLAnchorElement.href prepends localhost://
  const href = target.getAttribute("href");

  if (!href) return false;

  if (!isNoteLink(href)) return false;

  return href;
};

const nodeViews = (): EditorProps["nodeViews"] => {
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

      dom.addEventListener("click", (event) => {
        // If we don't, the link will be followed to /note-id.md.
        event.preventDefault();
      });
      return { dom };
    },
  };
};

interface NoteLinkPluginState {
  decorationSet: DecorationSet;
  note: NoteWithLinks | null;
}

// This plugin is responsible for storing the note (and link titles)
// in its state, as well as generating decorations with the note titles
// for links.
const noteLinkPlugin = new Plugin<NoteLinkPluginState>({
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
      let meta = tr.getMeta(noteLinkPlugin) as NoteWithLinks | undefined;

      // Otherwise, fall back to previously injected note from the state.
      let note = meta || state.note;

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
      return this.getState(state).decorationSet;
    },
  },
});

export const NoteEditor: React.FC<Props> = ({ note, onOpen, onUpdate }) => {
  const plugins = useMemo(
    () => [history(), keymap(buildKeymap(schema)), noteLinkPlugin],
    []
  );

  const doc = useMemo(() => markdownParser.parse(note.markdown), [note]);

  const [state, setState] = useProseMirror({
    doc,
    schema,
    plugins,
  });

  const _nodeViews = useMemo(() => nodeViews(), []);

  const viewRef = useRef() as RefObject<Handle>;

  useEffect(() => {
    // We need to use the viewRef instead of directly referencing
    // `state`, as that would require us to add `state` as a dependency
    // to this hook, making it re-run everytime there was any change in
    // the editor. We only want this to run when the note itself changes.
    const view = viewRef.current?.view;
    if (!view) return;

    const tr = view.state.tr;
    tr.setMeta(noteLinkPlugin, note);
    setState(view.state.apply(tr));
  }, [note, viewRef, setState]);

  const handleChange = useCallback(
    (state: EditorState) => {
      setState(state);
      onUpdate(markdownSerializer.serialize(state.doc));
    },
    [setState, onUpdate]
  );

  const handleClick = useCallback(
    (view: EditorView, pos: number, event: MouseEvent) => {
      const { target } = event;
      if (!target) return false;

      const noteId = getNoteID(target);
      if (!noteId) return false;

      const openMode = mouseEventToMode(event);

      event.stopPropagation();
      event.preventDefault();
      onOpen(noteId, openMode);
      return true;
    },
    [onOpen]
  );

  if (!note) {
    return null;
  }

  return (
    <div className="markdown">
      <ProseMirror
        ref={viewRef}
        handleClick={handleClick}
        handlePaste={(view, event, slice) => {
          console.log({ view, event, slice });
          return false;
        }}
        state={state}
        onChange={handleChange}
        nodeViews={_nodeViews}
      />
    </div>
  );
};
