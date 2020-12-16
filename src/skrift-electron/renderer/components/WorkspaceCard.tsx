import React from "react";
import { Stream, StreamLocation } from "../interfaces/streams";
import { CardToolbar } from "./CardToolbar";
import { Card } from "./Card";
import { CardBody } from "./CardBody";
import { CardToolbarItem } from "./CardToolbarItem";
import { MiniStream } from "./MiniStream";

type Props = {
  location: StreamLocation;
  streams: Stream[];
  onZoom: () => void;
};

export const WorkspaceCard: React.FC<Props> = ({
  location,
  streams,
  onZoom,
}) => {
  return (
    <Card location={location}>
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
              {streams.map((stream) => (
                <MiniStream key={stream.key} stream={stream} />
              ))}
            </div>
          </CardBody>
        </>
      )}
    </Card>
  );
};
