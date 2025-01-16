import React from "react";
import { StreamContainer } from "../containers/StreamContainer.js";
import { Stream } from "../interfaces/state/index.js";
import { DropStreamContainer } from "../containers/DropStreamContainer.js";

type Props = {
  streams: Stream[];
};

export const Streams: React.FC<Props> = ({ streams }) => {
  return (
    <div className="h-screen flex flex-col min-h-full text-sm px-1 bg-gray-200">
      {/* <DropStreamContainer mode="prepend" /> */}
      {streams.map((stream, index) => (
        <StreamContainer key={stream.key} path={[index]} stream={stream} />
      ))}
      {/* <DropStreamContainer mode="append" /> */}
    </div>
  );
};
