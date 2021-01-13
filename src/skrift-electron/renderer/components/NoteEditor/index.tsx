import "prosemirror-view/style/prosemirror.css";

import React, { useMemo } from "react";
import { Note } from "../../../../skrift/note";
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

interface Props {
  note: Note;
  onOpen: (id: string, mode: OpenCardMode) => void;
}

export const NoteEditor: React.FC<Props> = ({ note, onOpen }) => {
  const plugins = useMemo(() => [history(), keymap(buildKeymap(schema))], []);

  const doc = useMemo(() => defaultMarkdownParser.parse(note.markdown), [note]);

  const [state, setState] = useProseMirror({
    doc,
    schema,
    plugins,
  });

  if (!note) {
    return null;
  }

  return (
    <div className="markdown">
      <ProseMirror state={state} onChange={setState} />
    </div>
  );
};
