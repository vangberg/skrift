import React, { useMemo } from "react";
import { MiniNoteCardContainer } from "../containers/MiniNoteCardContainer";
import { Stream } from "../interfaces/state";
import { MiniSearchCard } from "./MiniSearchCard";

type Props = {
  stream: Stream;
};

export const MiniStream: React.FC<Props> = ({ stream }) => {
  const cards = useMemo(
    () =>
      stream.cards
        .map((card) => {
          switch (card.type) {
            case "note":
              return <MiniNoteCardContainer key={card.meta.key} id={card.id} />;
            case "search":
              return <MiniSearchCard key={card.meta.key} card={card} />;
            default:
              return null;
          }
        })
        .filter(Boolean),
    [stream]
  );

  return <div className="flex-1">{cards}</div>;
};
