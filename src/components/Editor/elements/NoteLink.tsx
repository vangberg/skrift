import React, { useMemo, useCallback } from "react";
import {
  RenderElementProps,
  useFocused,
  useSelected,
  useEditor,
  ReactEditor
} from "slate-react";
import { Note } from "../../../interfaces/note";
import cx from "classnames";

type Props = {
  getNote: (id: string) => Note;
  onOpen: (id: string) => void;
};

export const NoteLink: React.FC<RenderElementProps & Props> = ({
  getNote,
  onOpen,
  attributes,
  element,
  children
}) => {
  const note = useMemo(() => getNote(element.id), [getNote]);
  const selected = useSelected();
  const focused = useFocused();
  const editor = useEditor();

  const handleOpen = useCallback(() => {
    ReactEditor.blur(editor);
    onOpen(element.id);
  }, [onOpen, element]);

  return (
    <span
      {...attributes}
      className={cx({ "bg-gray-300": selected && focused })}
    >
      <span className="select-none">
        <span className="text-gray-500">[[</span>
        <span
          className="underline text-blue-600 cursor-pointer"
          onClick={handleOpen}
        >
          {note.title}
        </span>
        <span className="text-gray-500">]]</span>
        {children}
      </span>
    </span>
  );
};
