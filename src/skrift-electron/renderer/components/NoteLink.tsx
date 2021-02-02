import React, { useCallback } from "react";
import { NoteLink as NoteLinkType } from "../../../skrift/note";
import { OpenCardMode } from "../interfaces/state";
import { mouseEventToMode } from "../mouseEventToMode";

type Props = {
  link: NoteLinkType;
  onOpen: (id: string, mode: OpenCardMode) => void;
};

export const NoteLink: React.FC<Props> = ({ link, onOpen }) => {
  const { id, title } = link;

  const handleOpen = useCallback(
    (event: React.MouseEvent) => {
      onOpen(id, mouseEventToMode(event.nativeEvent));
    },
    [onOpen, id]
  );

  return (
    <span
      className="border-b border-blue-600 text-blue-600 cursor-pointer"
      onClick={handleOpen}
    >
      {title || id}
    </span>
  );
};
