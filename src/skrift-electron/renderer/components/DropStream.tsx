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
    <div
      ref={ref}
      className={clsx(
        "bg-gray-300 my-2 h-2 shadow-inner rounded opacity-0 transition-opacity",
        {
          "opacity-100": isDraggedOver,
        }
      )}
    >
    </div>
  );
};
