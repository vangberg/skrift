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
  onClose: () => void;
  onZoom: () => void;
  onSelect: (options?: { multi: boolean }) => void;
  onDeselect: () => void;
};

export const WorkspaceCard: React.FC<Props> = ({
  card,
  path,
  onSelect,
  onDeselect,
  onClose,
  onZoom,
}) => {
  return (
    <Card
      selected={card.meta.selected}
      onSelect={onSelect}
      onDeselect={onDeselect}
      path={path}
    >
      {(provided) => (
        <>
          <CardToolbar backgroundColor="bg-blue-300">
            <CardToolbarItem onClick={onZoom}>Zoom</CardToolbarItem>
            <CardToolbarItem onClick={onClose}>Close</CardToolbarItem>
            <CardToolbarItem {...provided.dragHandleProps}>
              Move
            </CardToolbarItem>
          </CardToolbar>

          <CardBody>
            <div className="flex-1 flex flex-row justify-center py-2 px-1">
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
