import React, { useMemo } from "react";
import { Droppable } from "react-beautiful-dnd";
import { NoteCardContainer } from "../containers/NoteCardContainer";
import { SearchCardContainer } from "../containers/SearchCardContainer";
import { DroppableIds } from "../interfaces/droppableIds";
import { Stream as StreamType, StreamIndex } from "../interfaces/streams";

type Props = {
  index: StreamIndex;
  stream: StreamType;
  onOpenSearch: () => void;
};

export const Stream: React.FC<Props> = ({ index, stream, onOpenSearch }) => {
  const cards = stream.cards.map((card, idx) => {
    switch (card.type) {
      case "note":
        return <NoteCardContainer {...card} location={[index, idx]} />;
      case "search":
        return (
          <SearchCardContainer
            key={card.key}
            card={card}
            location={[index, idx]}
          />
        );
    }
  });

  const droppableId = useMemo(
    () => DroppableIds.serialize({ type: "stream", index }),
    [index]
  );

  return (
    <Droppable droppableId={droppableId}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className="flex-1 skrift-flex-empty-0 overflow-y-auto min-w-sm max-w-2xl py-2"
        >
          {cards}
          {provided.placeholder}

          <div className="flex justify-center">
            <span
              onClick={onOpenSearch}
              className="p-1 text-gray-500 hover:bg-gray-500 hover:text-white rounded cursor-pointer select-none"
            >
              Search
            </span>
          </div>
        </div>
      )}
    </Droppable>
  );
};
