import React, { useMemo, useCallback, useState, useEffect } from "react";
import { Node } from "slate";
import { Slate, useFocused, ReactEditor } from "slate-react";
import cx from "classnames";

import { SkriftEditable } from "./Editable";
import { Serializer } from "../../interfaces/serializer";
import { Note } from "../../interfaces/note";
import { createEditor } from "./createEditor";
import { Close } from "./Close";

const deserialize = (markdown: string) => {
  const nodes = Serializer.deserialize(markdown);

  if (nodes.length > 0) {
    return nodes;
  }

  return [
    {
      type: "paragraph",
      children: [{ text: "" }]
    }
  ];
};

const areEqual = (n1: Node[], n2: Node[]) => {
  return JSON.stringify(n1) === JSON.stringify(n2);
};

type Props = {
  note: Note;
  onUpdate: (markdown: string) => void;
  onOpen: (id: string) => void;
  onClose: () => void;
  getNote: (id: string) => Note;
};

export const SkriftEditor: React.FC<Props> = ({
  note,
  onUpdate,
  onOpen,
  onClose,
  getNote
}) => {
  const editor = useMemo(() => createEditor(), []);
  const [value, setValue] = useState(() => deserialize(note.markdown));

  const handleChange = useCallback(
    (newValue: Node[]) => {
      if (areEqual(value, newValue)) {
        return;
      }
      setValue(newValue);
      onUpdate(Serializer.serialize(value));
    },
    [onUpdate]
  );

  return (
    <div className="shadow p-2 mb-2 bg-white border-2 border-white">
      <div className="float-right">
        <Close onClick={onClose} />
      </div>
      <Slate editor={editor} value={value} onChange={handleChange}>
        <SkriftEditable onOpen={onOpen} getNote={getNote} />
        {window.skriftDebug && (
          <pre className="text-xs">{JSON.stringify(value, undefined, 2)}</pre>
        )}
      </Slate>
    </div>
  );
};
