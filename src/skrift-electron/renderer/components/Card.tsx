import clsx from "clsx";
import React, { useMemo } from "react";
import { Draggable, DraggableChildrenFn } from "@atlaskit/pragmatic-drag-and-drop-react-beautiful-dnd-migration";
import { useUniqueId } from "../hooks/useUniqueId";
import { DraggableIds } from "../interfaces/draggableIds";
import { Path } from "../interfaces/path";
import { Card as CardType } from "../interfaces/state";

interface Props {
  path: Path;
  card: CardType;
  className?: string;
  children: DraggableChildrenFn;
}

export const Card: React.FC<Props> = ({ card, path, className, children }) => {
  const draggableId = DraggableIds.serialize(card.meta.key);

  return (
    <Draggable draggableId={draggableId} index={Path.last(path)}>
      {(provided, snapshot, ...rest) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={clsx(
            className,
            "skrift-card mx-2 my-2 relative flex flex-initial flex-col group"
          )}
        >
          <div className="relative flex-auto flex flex-col ">
            {children(provided, snapshot, ...rest)}
          </div>
        </div>
      )}
    </Draggable>
  );
};
