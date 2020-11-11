import React, { useCallback } from "react";
import {
  RenderElementProps,
  useFocused,
  useSelected,
  useEditor,
  ReactEditor,
} from "slate-react";
import { Note } from "../../../../../skrift/note";
import cx from "classnames";
import { NoteLinkContainer } from "../../../containers/NoteLinkContainer";

type Props = {
  onOpen: (id: string, push: boolean) => void;
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
      <NoteLinkContainer id={element.id} onOpen={handleOpen} />
      {children}
    </span>
  );
};
