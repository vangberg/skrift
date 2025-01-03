import React, { useCallback } from "react";
import { NoteCardContainer } from "../containers/NoteCardContainer";
import { SearchCardContainer } from "../containers/SearchCardContainer";
import { StreamPath } from "../interfaces/path";
import { OpenCardMode, Stream as StreamType } from "../interfaces/state";
import { mouseEventToMode } from "../mouseEventToMode";
import { DragDropCardContainer } from "../containers/DragDropCardContainer";

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
      className="flex-auto max-w-2xl py-2 flex flex-col overflow-y-auto"
      style={{ flexBasis: "100%" }}
    >
      <div className="flex justify-center">
        <span
          onClick={onMinimizeAll}
          className="p-1 text-gray-500 hover:bg-gray-500 hover:text-white rounded cursor-pointer select-none"
        >
          Minimize
        </span>
        <span
          onClick={onMaximizeAll}
          className="p-1 text-gray-500 hover:bg-gray-500 hover:text-white rounded cursor-pointer select-none"
        >
          Maximize
        </span>
        <span
          onClick={handleOpenSearch}
          className="p-1 text-gray-500 hover:bg-gray-500 hover:text-white rounded cursor-pointer select-none"
        >
          Search
        </span>
      </div>

      {cards}
    </div>
  );
};
