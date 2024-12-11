import "prosemirror-view/style/prosemirror.css";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { NoteID, NoteWithLinks } from "../../../../skrift/note";
import { OpenCardMode } from "../../interfaces/state";
import { ProseMirror, react, useEditorEffect } from "@nytimes/react-prosemirror";
import { keymap } from "prosemirror-keymap";
import { buildKeymap } from "./keymap";
import { history } from "prosemirror-history";
import { EditorView } from "prosemirror-view";
import { markdownParser, schema } from "../../../../skrift-markdown/parser";
import { EditorState } from "prosemirror-state";
import { markdownSerializer } from "../../../../skrift-markdown/serializer";
import { mouseEventToMode } from "../../mouseEventToMode";
import { nodeViews } from "./nodeViews";
import { noteLinkPlugin } from "./noteLinkPlugin";
import { buildInputRules } from "./inputrules";

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
      keymap(buildKeymap(schema)),
      buildInputRules(schema),
      noteLinkPlugin,
    ],
    []
  );

  const [state, setState] = useState(() =>
    EditorState.create({
      doc: markdownParser.parse(note.markdown),
      schema,
      plugins,
    }),
  );

  const handleChange = useCallback(
    (state: EditorState) => {
      setState(state)
      onUpdate(markdownSerializer.serialize(state.doc));
    },
    [onUpdate]
  );

  const _nodeViews = useMemo(() => nodeViews(), []);

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

  useEffect(() => {
    // Update note links when note changes
    const tr = state.tr;
    tr.setMeta(noteLinkPlugin, note);
    setState(state.apply(tr));
  }, [note]);


  if (!note) {
    return null;
  }

  return (
    <div className="p-2 markdown skrift-note-editor">
      <ProseMirror
        mount={mount}
        state={state}
        dispatchTransaction={(tr) => {
          handleChange(state.apply(tr));
        }}
        handleDOMEvents={handleDOMEvents}
        nodeViews={_nodeViews}
      >
        <div ref={setMount} />
      </ProseMirror>
    </div>
  );
};
