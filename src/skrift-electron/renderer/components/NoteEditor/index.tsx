import "prosemirror-view/style/prosemirror.css";

import React, {
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { Note, NoteID, NoteWithLinks } from "../../../../skrift/note";
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
import { Plugin, PluginKey } from "prosemirror-state";

interface Props {
  note: NoteWithLinks;
  onOpen: (id: string, mode: OpenCardMode) => void;
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

const clickToMode = (event: MouseEvent): OpenCardMode | false => {
  const { ctrlKey, metaKey, button } = event;
  const superKey = ctrlKey || metaKey;

  if (!superKey) return false;

  switch (button) {
    case 0:
      return "below";
    case 1:
      return "replace";
    case 2:
      return "push";
  }

  return false;
};

const nodeViews = (): EditorProps["nodeViews"] => {
  return {
    link: (node, view, getPos, decos) => {
      const dom = document.createElement("a");
      dom.setAttribute("href", node.attrs["href"]);

      const deco = decos.find((deco) => deco.spec.noteTitle);

      dom.innerText = deco
        ? deco.spec.noteTitle
        : node.content.firstChild!.text;

      dom.addEventListener("click", (event) => {
        event.stopPropagation();
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

const noteLinkPlugin = new Plugin<NoteLinkPluginState>({
  state: {
    init() {
      return {
        decorationSet: DecorationSet.empty,
        note: null,
      };
    },
    apply(tr, state) {
      let meta = tr.getMeta(noteLinkPlugin) as NoteWithLinks | undefined;
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
            {
              style: "border: 1px solid red;",
            },
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

export const NoteEditor: React.FC<Props> = ({ note, onOpen }) => {
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
    const view = viewRef.current?.view;
    if (!view) return;

    const tr = view.state.tr;
    tr.setMeta(noteLinkPlugin, note);
    setState(view.state.apply(tr));
  }, [note, viewRef, setState]);

  useEffect(() => {
    console.log("state changed");
    // const tr = state.tr
    // tr.setMeta(noteLinkPlugin, note.links)
  }, [state]);

  const handleClick = useCallback(
    (view: EditorView, pos: number, event: MouseEvent) => {
      const { target } = event;
      if (!target) return false;

      const noteId = getNoteID(target);
      if (!noteId) return false;

      const openMode = clickToMode(event);
      if (!openMode) return false;

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
        state={state}
        onChange={setState}
        nodeViews={_nodeViews}
      />
    </div>
  );
};
