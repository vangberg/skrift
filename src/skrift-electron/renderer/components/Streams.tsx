import React from "react";
import { StreamContainer } from "../containers/StreamContainer";
import { Stream } from "../interfaces/state";
import { DropStream } from "./DropStream";

type Props = {
  streams: Stream[];
};

export const Streams: React.FC<Props> = ({ streams }) => {
  return (
    <div className="h-screen flex-1 flex flex-row text-sm justify-center px-1 bg-gray-200">
      <DropStream path={[-1]} />
      {streams.map((stream, index) => (
        <StreamContainer key={stream.key} path={[index]} stream={stream} />
      ))}
      <DropStream path={[streams.length]} />
    </div>
  );
};
