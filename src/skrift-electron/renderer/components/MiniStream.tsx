import React, { useMemo } from "react";
import { MiniNoteCardContainer } from "../containers/MiniNoteCardContainer";
import { Stream as StreamType, StreamCard } from "../interfaces/streams";

type Props = {
  stream: StreamType;
};

export const MiniStream: React.FC<Props> = ({ stream }) => {
  const cards = useMemo(
    () =>
      stream.cards.filter(StreamCard.isNote).map((card) => {
        return <MiniNoteCardContainer key={card.key} id={card.id} />;
      }),
    [stream]
  );

  return <div>{cards}</div>;
};
