import clsx from "clsx";
import React, { useMemo } from "react";
import { Draggable, DraggableChildrenFn } from "react-beautiful-dnd";
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
          className={clsx(className, "shadow-md mx-2 mb-2 relative")}
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
