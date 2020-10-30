import React from "react";
import { DraggableProvidedDragHandleProps } from "react-beautiful-dnd";
import { Item } from "./Item";

type Props = {
  onClose: () => void;
  draggableProps?: DraggableProvidedDragHandleProps;
};

export const Toolbar: React.FC<Props> = ({ onClose, draggableProps }) => {
  return (
    <div className="flex">
      <Item onClick={onClose}>Close</Item>
      <Item {...draggableProps}>Move</Item>
    </div>
  );
};
