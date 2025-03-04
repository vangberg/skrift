import "prosemirror-view/style/prosemirror.css";
import "@benrbray/prosemirror-math/dist/prosemirror-math.css";
import "katex/dist/katex.min.css";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { NoteID, NoteWithLinks } from "../../../../skrift/note/index.js";
import { OpenCardMode } from "../../interfaces/state/index.js";
import { ProseMirror, react, useEditorEffect } from "@nytimes/react-prosemirror";
import { keymap } from "prosemirror-keymap";
import { mathPlugin } from "@benrbray/prosemirror-math";

import { buildKeymap } from "./keymap.js";
import { history } from "prosemirror-history";
import { EditorView } from "prosemirror-view";
import { markdownToProseMirror } from "../../../../skrift-markdown/parser.js";
import { schema } from "../../../../skrift-markdown/schema.js";
import { EditorState } from "prosemirror-state";
import { proseMirrorToMarkdown } from "../../../../skrift-markdown/serializer.js";
import { mouseEventToMode } from "../../mouseEventToMode.js";
import { buildInputRules } from "./inputrules.js";
import { AutoFocus } from "./AutoFocus.js";

interface Props {
  note: NoteWithLinks;
  focus: number;
  onOpen: (id: string, mode: OpenCardMode) => void;
  onUpdate: (markdown: string) => void;
}

const isNoteLink = (href: string): boolean => href.indexOf("://") < 0;

const getNoteID = (anchor: HTMLAnchorElement): NoteID | false => {
  // HTMLAnchorElement.href prepends localhost://
  const href = anchor.getAttribute("href");
  if (!href) return false;
  if (!isNoteLink(href)) return false;
  return href;
};

export const NoteEditor: React.FC<Props> = ({
  note,
  focus,
  onOpen,
  onUpdate,
}) => {
  const [mount, setMount] = useState<HTMLElement | null>(null);

  const plugins = useMemo(
    () => [
      history(),
      mathPlugin,
      keymap(buildKeymap(schema)),
      buildInputRules(schema),
    ],
    []
  );

  const [state, setState] = useState(() =>
    EditorState.create({
      doc: markdownToProseMirror(note.markdown),
      schema,
      plugins,
    }),
  );

  const handleChange = useCallback(
    (state: EditorState) => {
      setState(state)
      onUpdate(proseMirrorToMarkdown(state.doc));
    },
    [onUpdate]
  );

  const handleClick = useCallback(
    (view: EditorView, event: MouseEvent) => {
      const { target } = event;

      if (!(target instanceof HTMLAnchorElement)) {
        return false;
      }

      event.stopPropagation();
      event.preventDefault();


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


  const handleDOMEvents = useMemo(
    () => ({
      click: handleClick,
    }),
    [handleClick]
  );

  if (!note) {
    return null;
  }

  return (
    <div className="markdown skrift-note-editor flex flex-1 overflow-hidden">
      <ProseMirror
        mount={mount}
        state={state}
        dispatchTransaction={(tr) => {
          handleChange(state.apply(tr));
        }}
        handleDOMEvents={handleDOMEvents}
      >
        <AutoFocus />
        <div className="flex-1 overflow-y-auto" ref={setMount} />
      </ProseMirror>
    </div>
  );
};
