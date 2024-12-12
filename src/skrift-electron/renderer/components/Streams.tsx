import React from "react";
import { StreamContainer } from "../containers/StreamContainer";
import { Stream } from "../interfaces/state";
import { DropStreamContainer } from "../containers/DropStreamContainer";

type Props = {
  streams: Stream[];
};

export const Streams: React.FC<Props> = ({ streams }) => {
  return (
    <div className="h-screen flex-1 flex flex-row text-sm justify-center px-1 bg-gray-200">
      <DropStreamContainer mode="prepend" />
      {streams.map((stream, index) => (
        <StreamContainer key={stream.key} path={[index]} stream={stream} />
      ))}
      <DropStreamContainer mode="append" />
    </div>
  );
};
