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

const areEqual = (n1: Node[], n2: Node[]) => {
  return JSON.stringify(n1) === JSON.stringify(n2);
};

type Props = {
  note: Note;
  onUpdate: (slate: Node[]) => void;
  onDelete: () => void;
  onOpen: (id: string, push: boolean) => void;
  onClose: () => void;
};

export const SkriftEditor: React.FC<Props> = ({
  note,
  onUpdate,
  onDelete,
  onOpen,
  onClose,
}) => {
  const editor = useMemo(() => createEditor(), []);
  const [value, setValue] = useState(() => note.slate);

  // If the same note is opened multiple times, make sure
  // changes from the focused editor is propagated to the
  // non-focused editors.
  useEffect(() => {
    if (!ReactEditor.isFocused(editor)) {
      setValue(note.slate);
    }
  }, [editor, note.slate]);

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

  const handleDelete = useCallback(async () => {
    const { response } = await remote.dialog.showMessageBox({
      type: "question",
      message: `Are you sure you want to delete the note ${note.title}`,
      buttons: ["Yes", "No"],
    });
    if (response === 0) {
      onDelete();
    }
  }, [note.title, onDelete]);

  const handleCopy = useCallback(() => {
    clipboard.writeText(`[[${note.id}]]`);
  }, [note]);

  return (
    <div className="shadow rounded mb-2 mx-2 px-2 bg-white">
      <div className="float-right pt-2 pr-2">
        <Toolbar
          onCopy={handleCopy}
          onClose={onClose}
          onDelete={handleDelete}
        />
      </div>

      <div className="p-2">
        <Slate editor={editor} value={value} onChange={handleChange}>
          <SkriftEditable onOpen={onOpen} />

          {window.skriftDebug && (
            <pre className="text-xs">{JSON.stringify(value, undefined, 2)}</pre>
          )}
        </Slate>
      </div>

      <Backlinks note={note} onOpen={onOpen} />
    </div>
  );
};
