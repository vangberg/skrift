import React from "react";
import { WorkspaceCard } from "../interfaces/state";
import { MiniCard } from "./MiniCard";
import { MiniCardBody } from "./MiniCardBody";
import { MiniCardToolbar } from "./MiniCardToolbar";
import { MiniStream } from "./MiniStream";

type Props = {
  card: WorkspaceCard;
};

export const MiniWorkspace: React.FC<Props> = ({ card }) => {
  return (
    <MiniCard>
      <MiniCardToolbar backgroundColor="bg-blue-300" />
      <MiniCardBody>
        <div className="flex-1 flex flex-row h-0 justify-center px-1">
          {card.streams.map((stream, index) => (
            <MiniStream key={index} stream={stream} />
          ))}
        </div>
      </MiniCardBody>
    </MiniCard>
  );
};
