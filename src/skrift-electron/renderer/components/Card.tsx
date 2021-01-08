import React from "react";
import { Draggable, DraggableChildrenFn } from "react-beautiful-dnd";
import { useUniqueId } from "../hooks/useUniqueId";
import { Path } from "../interfaces/path";

interface Props {
  path: Path;
  children: DraggableChildrenFn;
}

export const Card: React.FC<Props> = ({ path, children }) => {
  const draggableId = useUniqueId();

  return (
    <Draggable
      draggableId={`stream-card-${draggableId}`}
      index={Path.last(path)}
    >
      {(provided, ...rest) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className="shadow-md mx-2 mb-2"
        >
          {children(provided, ...rest)}
        </div>
      )}
    </Draggable>
  );
};
