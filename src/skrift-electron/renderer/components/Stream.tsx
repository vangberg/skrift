import React from "react";
import { NoteCardContainer } from "../containers/NoteCardContainer.js";
import { SearchCardContainer } from "../containers/SearchCardContainer.js";
import { StreamPath } from "../interfaces/path/index.js";
import { Stream as StreamType } from "../interfaces/state/index.js";
import { DragDropCard } from "./DragDropCard.js";

type Props = {
  path: StreamPath;
  stream: StreamType;
};

export const Stream: React.FC<Props> = ({
  path,
  stream,
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

  return (
    <div
      className="h-full min-h-0 flex flex-col"
    >
      {cards}
    </div>
  );
};
