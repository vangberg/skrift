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

export const NoteEditor: React.FC<Props> = ({ note, onOpen, onUpdate }) => {
  const plugins = useMemo(
    () => [
      history(),
      keymap(buildKeymap(schema)),
      buildInputRules(schema),
      noteLinkPlugin,
    ],
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
