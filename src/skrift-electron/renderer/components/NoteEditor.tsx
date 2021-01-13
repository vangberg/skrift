import "prosemirror-view/style/prosemirror.css";

import React from "react";
import { Note } from "../../../skrift/note";
import { OpenCardMode } from "../interfaces/state";
import { ProseMirror, useProseMirror } from "use-prosemirror";
// @ts-ignore
import { schema } from "prosemirror-markdown";
import {
  defaultMarkdownParser,
  defaultMarkdownSerializer,
} from "prosemirror-markdown";

interface Props {
  note: Note;
  onOpen: (id: string, mode: OpenCardMode) => void;
}

export const NoteEditor: React.FC<Props> = ({ note, onOpen }) => {
  const [state, setState] = useProseMirror({
    doc: defaultMarkdownParser.parse(note.markdown),
    schema,
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
