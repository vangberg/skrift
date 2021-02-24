import clsx from "clsx";
import React, { useCallback, useState } from "react";
import { Draggable, DraggableChildrenFn } from "react-beautiful-dnd";
import { useUniqueId } from "../hooks/useUniqueId";
import { Path } from "../interfaces/path";

interface Props {
  path: Path;
  selected: boolean;
  onSelect: (options: { multi: boolean }) => void;
  onDeselect: () => void;
  children: DraggableChildrenFn;
}

export const Card: React.FC<Props> = ({
  path,
  selected,
  onSelect,
  onDeselect,
  children,
}) => {
  const draggableId = useUniqueId();

  // We use this to track whether we are in a click. If so, we will
  // ignore focus elements.
  const [click, setClick] = useState(false);

  const handleDown = useCallback(
    (event: React.PointerEvent) => {
      setClick(true);

      const multi = event.ctrlKey || event.metaKey;

      // If Ctrl/Cmd is clicked, it is part of a selection of multiple
      // cards, and we should not focus the card.
      if (multi) {
        event.preventDefault();
      }

      // If Ctrl/Cmd is clicked and card is already selected, it should
      // be removed from a selection of multiple cards.

      if (multi && selected) {
        onDeselect();
      } else {
        onSelect({ multi });
      }
    },
    [selected, onDeselect, onSelect]
  );

  const handleUp = useCallback(() => {
    setClick(false);
  }, []);

  const handleFocus = useCallback(() => {
    // If the focus is the result of a click, the click handler
    // is responsible for firing onSelect()
    if (!click) {
      onSelect({ multi: false });
    }
  }, [onSelect, click]);

  return (
    <Draggable
      draggableId={`stream-card-${draggableId}`}
      index={Path.last(path)}
    >
      {(provided, ...rest) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={clsx("shadow-md mx-2 mb-2", {
            "ring-2 ring-blue-300 rounded-t": selected,
          })}
          onPointerDownCapture={handleDown}
          onFocusCapture={handleFocus}
          onPointerUpCapture={handleUp}
        >
          {children(provided, ...rest)}
        </div>
      )}
    </Draggable>
  );
};
