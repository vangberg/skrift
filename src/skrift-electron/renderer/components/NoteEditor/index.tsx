import "prosemirror-view/style/prosemirror.css";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Note, NoteID } from "../../../../skrift/note";
import { OpenCardMode } from "../../interfaces/state";
import { ProseMirror, useProseMirror } from "use-prosemirror";
import {
  defaultMarkdownParser,
  defaultMarkdownSerializer,
} from "prosemirror-markdown";
import { keymap } from "prosemirror-keymap";
import { buildKeymap } from "./keymap";
import { history } from "prosemirror-history";
import { EditorProps, EditorView } from "prosemirror-view";
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
    link: (node, view) => {
      const dom = document.createElement("a");
      dom.setAttribute("href", node.attrs["href"]);

      const text = node.content.firstChild!.text;
      dom.innerText =
        text === "#" ? node.attrs["title"] || node.attrs["href"] : text;

      dom.addEventListener("click", (event) => {
        event.stopPropagation();
        event.preventDefault();
      });
      return { dom };
    },
  };
};

export const NoteEditor: React.FC<Props> = ({ note, onOpen }) => {
  const plugins = useMemo(() => [history(), keymap(buildKeymap(schema))], []);

  const doc = useMemo(() => markdownParser.parse(note.markdown), [note]);

  const [state, setState] = useProseMirror({
    doc,
    schema,
    plugins,
  });

  const nv = useMemo(nodeViews, []);

  useEffect(() => {
    console.log("set interval");
    const i = setInterval(() => {
      const m = Math.random().toString();
      const tr = state.tr;
      state.doc.descendants((n, p) => {
        if (n.type.name === "link") {
          tr.setNodeMarkup(p, undefined, { href: n.attrs["href"], title: m });
        }
      });
      setState(state.apply(tr));
    }, 1000);
    return () => clearInterval(i);
  }, [state, setState]);

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
