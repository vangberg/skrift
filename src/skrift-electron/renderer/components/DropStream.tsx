import clsx from "clsx";
import React, { useEffect, useRef, useState } from "react";
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter'

type Props = {
  mode: "prepend" | "append";
  onDrop: (key: number) => void;
};

export const DropStream: React.FC<Props> = ({ mode, onDrop }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isDraggedOver, setIsDraggedOver] = useState(false);

  useEffect(() => {
    const el = ref.current;

    if (!el) return;

    return dropTargetForElements({
      element: el,
      onDragEnter: () => setIsDraggedOver(true),
      onDragLeave: () => setIsDraggedOver(false),
      onDrop: ({ source }) => {
        setIsDraggedOver(false);
        const sourceKey = source.data.key as number;
        onDrop(sourceKey);
      },
    });
  }, []);

  return (
    // <Droppable droppableId={droppableId}>
    // {(provided, snapshot) => (
    <div
      // ref={provided.innerRef}
      // {...provided.droppableProps}
      ref={ref}
      className={clsx(
        "bg-gray-300 my-2 w-20 shadow-inner rounded opacity-0 transition-opacity",
        {
          "opacity-100": isDraggedOver,
          // "opacity-100": snapshot.isDraggingOver,
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
      <div className="hidden"></div>
    </div>
    // )}
    // </Droppable>
  );
};
