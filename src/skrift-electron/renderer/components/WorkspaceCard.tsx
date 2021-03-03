import React, { useCallback, useState } from "react";
import { CardToolbar } from "./CardToolbar";
import { Card } from "./Card";
import { CardBody } from "./CardBody";
import { CardToolbarItem } from "./CardToolbarItem";
import { MiniStream } from "./MiniStream";
import {
  Workspace,
  WorkspaceCard as WorkspaceCardType,
} from "../interfaces/state";
import { Path } from "../interfaces/path";
import clsx from "clsx";

type Props = {
  card: WorkspaceCardType;
  path: Path;
  onClose: () => void;
  onZoomIn: () => void;
};

export const WorkspaceCard: React.FC<Props> = ({
  card,
  path,
  onClose,
  onZoomIn,
}) => {
  const handleZoom = useCallback(() => onZoomIn(), [onZoomIn]);

  return (
    <Card
      card={card}
      path={path}
      className={clsx(
        "transition-all",
        card.zoom ? "transform scale-150" : "transform scale-100"
      )}
    >
      {(provided) => (
        <>
          <CardToolbar backgroundColor="bg-blue-300">
            <CardToolbarItem onClick={handleZoom}>Zoom</CardToolbarItem>
            <CardToolbarItem onClick={onClose}>Close</CardToolbarItem>
            <CardToolbarItem {...provided.dragHandleProps}>
              Move
            </CardToolbarItem>
          </CardToolbar>

          <CardBody>
            {Workspace.isEmpty(card) ? (
              <div className="h-12 flex items-center justify-center text-gray-500 select-none">
                Drag cards here
              </div>
            ) : (
              <div className="flex-1 flex flex-row justify-center py-2 px-1">
                {card.streams.map((stream) => (
                  <MiniStream key={stream.key} stream={stream} />
                ))}
              </div>
            )}
          </CardBody>
        </>
      )}
    </Card>
  );
};
