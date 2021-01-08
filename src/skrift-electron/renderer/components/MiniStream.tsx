import React, { useMemo } from "react";
import { MiniNoteCardContainer } from "../containers/MiniNoteCardContainer";
import { Card, Stream } from "../interfaces/state";

type Props = {
  stream: Stream;
};

export const MiniStream: React.FC<Props> = ({ stream }) => {
  const cards = useMemo(
    () =>
      stream.cards.filter(Card.isNote).map((card) => {
        return <MiniNoteCardContainer key={card.key} id={card.id} />;
      }),
    [stream]
  );

  return <div className="flex-1">{cards}</div>;
};
