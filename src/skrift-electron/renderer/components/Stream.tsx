import React, { useCallback } from "react";
import { NoteCardContainer } from "../containers/NoteCardContainer.js";
import { SearchCardContainer } from "../containers/SearchCardContainer.js";
import { StreamPath } from "../interfaces/path/index.js";
import { OpenCardMode, Stream as StreamType } from "../interfaces/state/index.js";
import { mouseEventToMode } from "../mouseEventToMode.js";
import { Icon } from "./Icon.js";
import { DragDropCard } from "./DragDropCard.js";

type Props = {
  path: StreamPath;
  stream: StreamType;
  onOpenSearch: (query: string, mode: OpenCardMode) => void;
  onMinimizeAll: () => void;
  onMaximizeAll: () => void;
};

export const Stream: React.FC<Props> = ({
  path,
  stream,
  onOpenSearch,
  onMinimizeAll,
  onMaximizeAll,
}) => {
  const cards = stream.cards.map((card, idx) => {
    switch (card.type) {
      case "note":
        return (
          <DragDropCard key={card.meta.key} card={card}>
            <NoteCardContainer
              card={card}
              path={[...path, idx]}
            />
          </DragDropCard>
        );
      case "search":
        return (
          <DragDropCard key={card.meta.key} card={card}>
            <SearchCardContainer
              key={card.meta.key}
              card={card}
              path={[...path, idx]}
            />
          </DragDropCard>
        );
    }
  });



  const handleOpenSearch = useCallback(
    (event: React.MouseEvent) =>
      onOpenSearch("", mouseEventToMode(event.nativeEvent)),
    [onOpenSearch]
  );

  return (
    <div
      className="p-2 flex-1 flex flex-row gap-2 h-full overflow-hidden"
    >
      <div className="flex items-center">
        <span
          onClick={handleOpenSearch}
          className="p-1 text-gray-500 hover:bg-gray-500 hover:text-white rounded cursor-pointer select-none"
        >
          <Icon name="search" className="w-4 h-4" />
        </span>
      </div>

      {cards}
    </div>
  );
};
