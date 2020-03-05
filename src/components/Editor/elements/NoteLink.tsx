import React, { useCallback } from "react";
import {
  RenderElementProps,
  useFocused,
  useSelected,
  useEditor,
  ReactEditor
} from "slate-react";
import { Note } from "../../../interfaces/note";
import { NoteLink as BaseNoteLink } from "../NoteLink";
import cx from "classnames";

type Props = {
  getNote: (id: string) => Note | undefined;
  onOpen: (id: string, push: boolean) => void;
};

export const NoteLink: React.FC<RenderElementProps & Props> = ({
  getNote,
  onOpen,
  attributes,
  element,
  children
}) => {
  const selected = useSelected();
  const focused = useFocused();
  const editor = useEditor();

  const handleOpen = useCallback(
    (id, push) => {
      ReactEditor.blur(editor);
      onOpen(id, push);
    },
    [editor, onOpen]
  );

  return (
    <span
      {...attributes}
      className={cx({ "bg-gray-300": selected && focused })}
    >
      <BaseNoteLink id={element.id} onOpen={handleOpen} getNote={getNote} />
      {children}
    </span>
  );
};
