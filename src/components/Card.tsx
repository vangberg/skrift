import React from "react";
import { Draggable, DraggableChildrenFn } from "react-beautiful-dnd";
import { StreamLocation } from "../interfaces/streams";
import { useUniqueId } from "../useUniqueId";

interface Props {
  location: StreamLocation;
  children: DraggableChildrenFn;
}

export const Card: React.FC<Props> = ({ location, children }) => {
  const draggableId = useUniqueId();

  return (
    <Draggable draggableId={`stream-card-${draggableId}`} index={location[1]}>
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
