import React from "react";
import { DraggableProvidedDragHandleProps } from "react-beautiful-dnd";
import { Item } from "./Item";

type Props = {
  onClose: () => void;
  draggableProps?: DraggableProvidedDragHandleProps;
};

export const Toolbar: React.FC<Props> = ({ onClose, draggableProps }) => {
  return (
    <div className="flex px-2 py-1 justify-end bg-orange-300 rounded-t">
      <Item onClick={onClose}>Close</Item>
      <Item {...draggableProps}>Move</Item>
    </div>
  );
};
