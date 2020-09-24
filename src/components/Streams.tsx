import React from "react";
import { Streams as StreamsType } from "../interfaces/streams";
import { Stream } from "./Stream";

type Props = {
  streams: StreamsType;
};

export const Streams: React.FC<Props> = ({ streams }) => {
  return (
    <>
      {streams.map((stream, index) => (
        <Stream key={stream.key} index={index} stream={stream} />
      ))}
    </>
  );
};
