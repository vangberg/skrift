import clsx from "clsx";
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
      {(provided, snapshot, ...rest) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className="shadow-md mx-2 mb-2 relative"
        >
          <div
            className={clsx(
              "absolute top-0 right-0 left-0 bottom-0 z-10 bg-black transition-all",
              snapshot.combineTargetFor
                ? "opacity-30 visible"
                : "opacity-0 invisible"
            )}
          ></div>
          <div className="relative">
            {children(provided, snapshot, ...rest)}
          </div>
        </div>
      )}
    </Draggable>
  );
};
