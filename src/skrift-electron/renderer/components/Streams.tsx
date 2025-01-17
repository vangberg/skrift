import React from "react";
import { StreamContainer } from "../containers/StreamContainer.js";
import { Stream } from "../interfaces/state/index.js";
import { DragDropStreamContainer } from "../containers/DragDropStreamContainer.js";
type Props = {
  streams: Stream[];
};

export const Streams: React.FC<Props> = ({ streams }) => {
  return (
    <div className="h-screen flex flex-col min-h-full text-sm bg-gray-200">
      {streams.map((stream, index) => (
        <DragDropStreamContainer key={stream.key} stream={stream}>
          <StreamContainer key={stream.key} path={[index]} stream={stream} />
        </DragDropStreamContainer>
      ))}
    </div>
  );
};
