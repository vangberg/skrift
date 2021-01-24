import "prosemirror-view/style/prosemirror.css";

import React, {
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { Note, NoteID } from "../../../../skrift/note";
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
  note: Note;
  onOpen: (id: string, mode: OpenCardMode) => void;
}

const getNoteID = (target: EventTarget): NoteID | false => {
  if (!(target instanceof HTMLAnchorElement)) {
    return false;
  }

  // HTMLAnchorElement.href prepends localhost://
  const href = target.getAttribute("href");

  if (!href) return false;

  if (href.indexOf("://") >= 0) return false;

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

const noteLinkPlugin = new Plugin<DecorationSet>({
  state: {
    init() {
      return DecorationSet.empty;
    },
    apply(tr, set) {
      console.log("calc");
      set = DecorationSet.empty;

      const decos: Decoration[] = [];

      tr.doc.descendants((node, pos) => {
        if (node.type.name === "link") {
          decos.push(
            Decoration.node(
              pos,
              pos + node.nodeSize,
              {
                style: "border: 1px solid red;",
              },
              { noteTitle: Math.random().toString() }
            )
          );
        }
      });

      set = set.add(tr.doc, decos);

      return set;
    },
  },
  props: {
    decorations(state) {
      return this.getState(state);
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

  const nv = useMemo(() => nodeViews(), []);

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
        handleClick={handleClick}
        state={state}
        onChange={setState}
        nodeViews={nv}
      />
    </div>
  );
};
