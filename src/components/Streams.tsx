import React from "react";
import { StreamContainer } from "../containers/StreamContainer";
import { Streams as StreamsType } from "../interfaces/streams";

type Props = {
  streams: StreamsType;
};

export const Streams: React.FC<Props> = ({ streams }) => {
  return (
    <>
      {streams.map((stream, index) => (
        <StreamContainer key={stream.key} index={index} stream={stream} />
      ))}
    </>
  );
};
