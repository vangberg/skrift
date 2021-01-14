import "prosemirror-view/style/prosemirror.css";

import React, { useCallback, useMemo } from "react";
import { Note, NoteID } from "../../../../skrift/note";
import { OpenCardMode } from "../../interfaces/state";
import { ProseMirror, useProseMirror } from "use-prosemirror";
// @ts-ignore
import { schema } from "prosemirror-markdown";
import {
  defaultMarkdownParser,
  defaultMarkdownSerializer,
} from "prosemirror-markdown";
import { keymap } from "prosemirror-keymap";
import { buildKeymap } from "./keymap";
import { history } from "prosemirror-history";
import { EditorView } from "prosemirror-view";

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

export const NoteEditor: React.FC<Props> = ({ note, onOpen }) => {
  const plugins = useMemo(() => [history(), keymap(buildKeymap(schema))], []);

  const doc = useMemo(() => defaultMarkdownParser.parse(note.markdown), [note]);

  const [state, setState] = useProseMirror({
    doc,
    schema,
    plugins,
  });

  const handleClick = useCallback(
    (view: EditorView, pos: number, event: MouseEvent) => {
      const { target } = event;
      const { ctrlKey, shiftKey, button } = event;
      console.log({ ctrlKey, shiftKey, button });
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
      />
    </div>
  );
};
