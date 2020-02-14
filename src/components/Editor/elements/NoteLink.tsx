import React, { useMemo } from "react";
import { RenderElementProps, useFocused, useSelected } from "slate-react";
import { Note } from "../../../interfaces/note";
import cx from "classnames";

type Props = {
  getNote: (id: string) => Note;
};

export const NoteLink: React.FC<RenderElementProps & Props> = ({
  getNote,
  attributes,
  element,
  children
}) => {
  const note = useMemo(() => getNote(element.id), [getNote]);
  const selected = useSelected();

  return (
    <span {...attributes} className={cx({ "bg-gray-300": selected })}>
      <span className="text-gray-500">[[</span>
      <span className="underline text-blue-600 cursor-pointer">
        {note.title}
      </span>
      <span className="text-gray-500">]]</span>
      {children}
    </span>
  );
};
