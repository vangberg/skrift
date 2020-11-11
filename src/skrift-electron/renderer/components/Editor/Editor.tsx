import React, { useMemo, useCallback, useState, useEffect } from "react";
import { Node } from "slate";
import { Slate, ReactEditor } from "slate-react";

import { SkriftEditable } from "./Editable";
import { Note } from "../../../../skrift/note";
import { createEditor } from "./createEditor";

const areEqual = (n1: Node[], n2: Node[]) => {
  return JSON.stringify(n1) === JSON.stringify(n2);
};

type Props = {
  note: Note;
  onOpen: (id: string, push: boolean) => void;
  onUpdate: (slate: Node[]) => void;
};

export const SkriftEditor: React.FC<Props> = ({ note, onOpen, onUpdate }) => {
  const editor = useMemo(() => createEditor(), []);
  const [value, setValue] = useState(() => note.slate);

  // If the same note is opened multiple times, make sure
  // changes from the focused editor is propagated to the
  // non-focused editors.
  useEffect(() => {
    if (!ReactEditor.isFocused(editor)) {
      setValue(note.slate);
    }
  }, [editor, value, note.slate]);

  const handleChange = useCallback(
    (newValue: Node[]) => {
      if (areEqual(value, newValue)) {
        return;
      }
      setValue(newValue);
      onUpdate(newValue);
    },
    [onUpdate, value]
  );

  return (
    <Slate editor={editor} value={value} onChange={handleChange}>
      <SkriftEditable onOpen={onOpen} />

      {window.skriftDebug && (
        <pre className="text-xs">{JSON.stringify(value, undefined, 2)}</pre>
      )}
    </Slate>
  );
};
