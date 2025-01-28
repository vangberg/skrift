import React from "react";
import { Stream } from "../components/Stream.js";
import { Stream as StreamType } from "../interfaces/state/index.js";
import { StreamPath } from "../interfaces/path/index.js";

interface Props {
  path: StreamPath;
  stream: StreamType;
}

export const StreamContainer: React.FC<Props> = ({ path, stream }) => {
  return (
    <Stream
      path={path}
      stream={stream}
    />
  );
};
