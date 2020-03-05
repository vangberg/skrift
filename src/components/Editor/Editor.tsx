import React, { useMemo, useCallback, useState, useEffect } from "react";
import { Node } from "slate";
import { Slate, ReactEditor } from "slate-react";
import { remote, clipboard } from "electron";

import { SkriftEditable } from "./Editable";
import { Serializer } from "../../interfaces/serializer";
import { Note } from "../../interfaces/note";
import { createEditor } from "./createEditor";
import { Backlinks } from "./Backlinks";
import { Toolbar } from "./Toolbar";

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
  onDelete: () => void;
  onOpen: (id: string) => void;
  onClose: () => void;
  getNote: (id: string) => Note | undefined;
};

export const SkriftEditor: React.FC<Props> = ({
  note,
  onUpdate,
  onDelete,
  onOpen,
  onClose,
  getNote
}) => {
  const editor = useMemo(() => createEditor(), []);
  const [value, setValue] = useState(() => deserialize(note.markdown));

  // If the same note is opened multiple times, make sure
  // changes from the focused editor is propagated to the
  // non-focused editors.
  useEffect(() => {
    if (!ReactEditor.isFocused(editor)) {
      setValue(deserialize(note.markdown));
    }
  }, [editor, note.markdown]);

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

  const handleDelete = useCallback(async () => {
    const { response } = await remote.dialog.showMessageBox({
      type: "question",
      message: `Are you sure you want to delete the note ${note.title}`,
      buttons: ["Yes", "No"]
    });
    if (response === 0) {
      onDelete();
    }
  }, [note.title, onDelete]);

  const handleCopy = useCallback(() => {
    clipboard.writeText(`[[${note.id}]]`);
  }, [note]);

  return (
    <div className="shadow mb-2 bg-white">
      <div className="float-right p-2">
        <Toolbar
          onCopy={handleCopy}
          onClose={onClose}
          onDelete={handleDelete}
        ></Toolbar>
      </div>

      <div className="p-2 text-sm">
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
