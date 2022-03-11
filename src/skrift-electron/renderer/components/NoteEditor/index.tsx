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
import { EditorState, TextSelection } from "prosemirror-state";
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

  const handleChange = useCallback(
    (state: EditorState) => {
      setState(state);
      onUpdate(markdownSerializer.serialize(state.doc));
    },
    [setState, onUpdate]
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

  const domEvents = useMemo(
    () => ({
      click: handleClick,
    }),
    [handleClick]
  );

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

  useEffect(() => {
    const view = viewRef.current?.view;
    if (!view) return;

    // Set initial selection to end of document, so the initial
    // focus after render starts at the end of the note.
    view.dispatch(
      view.state.tr.setSelection(TextSelection.atEnd(view.state.doc))
    );
  }, []);

  useEffect(() => {
    const view = viewRef.current?.view;
    if (!view) return;

    // Focus the editor each time the `focus` number is increased.
    view.focus();
  }, [focus]);

  if (!note) {
    return null;
  }

  return (
    <div className="p-2 markdown skrift-note-editor">
      <ProseMirror
        ref={viewRef}
        handleDOMEvents={domEvents}
        state={state}
        onChange={handleChange}
        nodeViews={_nodeViews}
      />
    </div>
  );
};
