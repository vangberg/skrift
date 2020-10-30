import React, { useCallback, useContext } from "react";
import { Stream as StreamType, StreamIndex } from "../interfaces/streams";
import { Stream } from "../components/Stream";
import { StateContext } from "../state";

interface Props {
  index: StreamIndex;
  stream: StreamType;
}

export const StreamContainer: React.FC<Props> = ({ index, stream }) => {
  const [, dispatch] = useContext(StateContext);

  const handleOpenSearch = useCallback(
    () => dispatch({ type: "streams/OPEN_SEARCH", stream: index }),
    [dispatch, index]
  );

  return (
    <Stream index={index} stream={stream} onOpenSearch={handleOpenSearch} />
  );
};
