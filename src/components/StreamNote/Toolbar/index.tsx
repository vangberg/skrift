import React from "react";
import { DraggableProvidedDragHandleProps } from "react-beautiful-dnd";
import { Item } from "./Item";

type Props = {
  onClose: () => void;
  onDelete: () => void;
  onCopy: () => void;
  draggableProps?: DraggableProvidedDragHandleProps;
};

export const Toolbar: React.FC<Props> = ({
  onCopy,
  onDelete,
  onClose,
  draggableProps,
}) => {
  return (
    <div className="flex">
      <Item onClick={onDelete}>Delete</Item>
      <Item onClick={onCopy}>Copy link</Item>
      <Item onClick={onClose}>Close</Item>
      <Item {...draggableProps}>Move</Item>
    </div>
  );
};
