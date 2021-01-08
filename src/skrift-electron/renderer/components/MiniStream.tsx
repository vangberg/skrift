import React, { useMemo } from "react";
import { MiniNoteCardContainer } from "../containers/MiniNoteCardContainer";
import { Stream } from "../interfaces/state";
import { MiniWorkspace } from "./MiniWorkspace";

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
              return <MiniNoteCardContainer key={card.key} id={card.id} />;
            case "workspace":
              return <MiniWorkspace key={card.key} card={card} />;
            default:
              return null;
          }
        })
        .filter(Boolean),
    [stream]
  );

  return <div className="flex-1">{cards}</div>;
};
