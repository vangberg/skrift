import React, { useMemo, useCallback, useState } from "react";
import { Node } from "slate";
import { Slate } from "slate-react";

import { SkriftEditable } from "./Editable";
import { Serializer } from "../../interfaces/serializer";
import { Note } from "../../interfaces/note";
import { createEditor } from "./createEditor";

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

type Props = {
  markdown: string;
  onUpdate: (markdown: string) => void;
  onOpen: (id: string) => void;
  getNote: (id: string) => Note;
};

export const SkriftEditor: React.FC<Props> = ({
  markdown,
  onUpdate,
  onOpen,
  getNote
}) => {
  const editor = useMemo(() => createEditor(), []);

  const [value, setValue] = useState(() => deserialize(markdown));

  const handleChange = useCallback(
    (value: Node[]) => {
      setValue(value);
      onUpdate(Serializer.serialize(value));
    },
    [onUpdate]
  );

  return (
    <Slate editor={editor} value={value} onChange={handleChange}>
      <SkriftEditable onOpen={onOpen} getNote={getNote} />
      {window.skriftDebug && (
        <pre className="text-xs">{JSON.stringify(value, undefined, 2)}</pre>
      )}
    </Slate>
  );
};
