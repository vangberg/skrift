import React, { useMemo, useCallback, useState } from "react";
import { Node } from "slate";
import { Slate } from "slate-react";

import { SkriftEditable } from "./Editable";
import { Serializer } from "../../interfaces/serializer";
import { Note } from "../../interfaces/note";
import { createEditor } from "./createEditor";
import { Close } from "./Close";
import { Backlinks } from "./Backlinks";

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
  getNote: (id: string) => Note | undefined;
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
      onUpdate(Serializer.serialize(newValue));
    },
    [onUpdate, value]
  );

  return (
    <div className="shadow mb-2 bg-white">
      <div className="float-right p-2">
        <Close onClick={onClose} />
      </div>

      <div className="p-2">
        <Slate editor={editor} value={value} onChange={handleChange}>
          <SkriftEditable onOpen={onOpen} getNote={getNote} />
          {window.skriftDebug && (
            <pre className="text-xs">{JSON.stringify(value, undefined, 2)}</pre>
          )}
        </Slate>
      </div>

      <Backlinks note={note} onOpen={onOpen} getNote={getNote} />
    </div>
  );
};
