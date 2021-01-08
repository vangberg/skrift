import React from "react";
import { CardToolbar } from "./CardToolbar";
import { Card } from "./Card";
import { CardBody } from "./CardBody";
import { CardToolbarItem } from "./CardToolbarItem";
import { MiniStream } from "./MiniStream";
import { WorkspaceCard as WorkspaceCardType } from "../interfaces/state";
import { Path } from "../interfaces/path";

type Props = {
  card: WorkspaceCardType;
  path: Path;
  onZoom: () => void;
};

export const WorkspaceCard: React.FC<Props> = ({ card, path, onZoom }) => {
  return (
    <Card path={path}>
      {(provided) => (
        <>
          <CardToolbar backgroundColor="bg-orange-300">
            <CardToolbarItem onClick={onZoom}>Zoom</CardToolbarItem>
            <CardToolbarItem {...provided.dragHandleProps}>
              Move
            </CardToolbarItem>
          </CardToolbar>

          <CardBody>
            <div className="flex-1 flex flex-row justify-center px-1">
              {card.streams.map((stream) => (
                <MiniStream key={stream.key} stream={stream} />
              ))}
            </div>
          </CardBody>
        </>
      )}
    </Card>
  );
};
