import React, { useCallback, useMemo } from "react";
import { Droppable } from "react-beautiful-dnd";
import { NoteCardContainer } from "../containers/NoteCardContainer";
import { SearchCardContainer } from "../containers/SearchCardContainer";
import { WorkspaceCardContainer } from "../containers/WorkspaceCardContainer";
import { DroppableIds } from "../interfaces/droppableIds";
import { Path } from "../interfaces/path";
import { OpenCardMode, Stream as StreamType } from "../interfaces/state";
import { mouseEventToMode } from "../mouseEventToMode";

type Props = {
  path: Path;
  stream: StreamType;
  onOpenSearch: (query: string, mode: OpenCardMode) => void;
};

export const Stream: React.FC<Props> = ({ path, stream, onOpenSearch }) => {
  const cards = stream.cards.map((card, idx) => {
    switch (card.type) {
      case "note":
        return (
          <NoteCardContainer key={card.key} card={card} path={[...path, idx]} />
        );
      case "search":
        return (
          <SearchCardContainer
            key={card.key}
            card={card}
            path={[...path, idx]}
          />
        );
      case "workspace":
        return (
          <WorkspaceCardContainer
            key={card.key}
            card={card}
            path={[...path, idx]}
          />
        );
    }
  });

  const droppableId = useMemo(() => DroppableIds.serialize(path), [path]);

  const handleOpenSearch = useCallback(
    (event: React.MouseEvent) =>
      onOpenSearch("", mouseEventToMode(event.nativeEvent)),
    [onOpenSearch]
  );
  const handleOpenAll = useCallback(
    (event: React.MouseEvent) =>
      onOpenSearch("*", mouseEventToMode(event.nativeEvent)),
    [onOpenSearch]
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
              onClick={handleOpenAll}
              className="p-1 text-gray-500 hover:bg-gray-500 hover:text-white rounded cursor-pointer select-none"
            >
              All
            </span>
            <span
              onClick={handleOpenSearch}
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
