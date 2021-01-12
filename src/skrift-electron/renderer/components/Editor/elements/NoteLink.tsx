import React, { useCallback } from "react";
import {
  RenderElementProps,
  useFocused,
  useSelected,
  useEditor,
  ReactEditor,
} from "slate-react";
import { NoteID } from "../../../../../skrift/note";
import cx from "classnames";
import { NoteLinkContainer } from "../../../containers/NoteLinkContainer";
import { OpenCardMode } from "../../../interfaces/state";

type Props = {
  onOpen: (id: string, mode: OpenCardMode) => void;
};

export const NoteLink: React.FC<RenderElementProps & Props> = ({
  onOpen,
  attributes,
  element,
  children,
}) => {
  const selected = useSelected();
  const focused = useFocused();
  const editor = useEditor();

  const handleOpen = useCallback(
    (id: NoteID, mode: OpenCardMode) => {
      ReactEditor.blur(editor);
      onOpen(id, mode);
    },
    [editor, onOpen]
  );

  return (
    <span
      {...attributes}
      className={cx({ "bg-gray-300": selected && focused })}
    >
      <NoteLinkContainer id={element.id} onOpen={handleOpen} />
      {children}
    </span>
  );
};
