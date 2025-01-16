import React, { useCallback } from "react";
import { NoteCardContainer } from "../containers/NoteCardContainer.js";
import { SearchCardContainer } from "../containers/SearchCardContainer.js";
import { StreamPath } from "../interfaces/path/index.js";
import { OpenCardMode, Stream as StreamType } from "../interfaces/state/index.js";
import { mouseEventToMode } from "../mouseEventToMode.js";
import { DragDropCardContainer } from "../containers/DragDropCardContainer.js";
import { Icon } from "./Icon.js";

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
          <DragDropCardContainer card={card} key={card.meta.key}>
            <NoteCardContainer
              card={card}
              path={[...path, idx]}
            />
          </DragDropCardContainer>
        );
      case "search":
        return (
          <DragDropCardContainer card={card} key={card.meta.key}>
            <SearchCardContainer
              key={card.meta.key}
              card={card}
              path={[...path, idx]}
            />
          </DragDropCardContainer>
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
      className="py-2 flex-1 flex flex-row h-full overflow-hidden"
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
