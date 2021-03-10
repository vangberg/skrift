import clsx from "clsx";
import React, { useMemo } from "react";
import { Droppable } from "react-beautiful-dnd";
import { DroppableIds } from "../interfaces/droppableIds";
import { Path } from "../interfaces/path";

type Props = {
  path: Path;
};

export const DropStream: React.FC<Props> = ({ path }) => {
  const droppableId = useMemo(() => DroppableIds.serialize(path), [path]);

  return (
    <Droppable droppableId={droppableId} isCombineEnabled>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={clsx(
            "bg-gray-300 my-2 w-20 shadow-inner rounded opacity-0 transition-opacity",
            {
              "opacity-100": snapshot.isDraggingOver,
            }
          )}
          style={{
            flexGrow: 1,
            flexShrink: 0,
            flexBasis: "auto",
          }}
        >
          {/*
          In this case we do not want to change the size when something
          is dragged into the drop stream.
           */}
          <div className="hidden">{provided.placeholder}</div>
        </div>
      )}
    </Droppable>
  );
};
