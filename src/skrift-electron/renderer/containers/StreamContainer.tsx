import React, { useCallback, useContext } from "react";
import { Stream as StreamType, StreamIndex } from "../interfaces/streams";
import { Stream } from "../components/Stream";
import { StreamsContext } from "../hooks/useStreams";

interface Props {
  index: StreamIndex;
  stream: StreamType;
}

export const StreamContainer: React.FC<Props> = ({ index, stream }) => {
  const [, { openSearch }] = useContext(StreamsContext);

  const handleOpenSearch = useCallback((query?: string) => openSearch(index, query), [
    openSearch,
    index,
  ]);

  return (
    <Stream index={index} stream={stream} onOpenSearch={handleOpenSearch} />
  );
};
