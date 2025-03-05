import React, { useCallback, useContext } from "react";
import { Stream } from "../components/Stream.js";
import { OpenCardMode, Stream as StreamType } from "../interfaces/state/index.js";
import { StreamPath } from "../interfaces/path/index.js";
import { StateContext } from "../interfaces/state/index.js";

interface Props {
  path: StreamPath;
  stream: StreamType;
}

export const StreamContainer: React.FC<Props> = ({ path, stream }) => {
  const [, { openCard }] = useContext(StateContext);

  const handleOpenSearch = useCallback((mode: OpenCardMode) => {
    openCard([...path, stream.cards.length], mode, {
      type: "search",
      query: "",
    });
  }, [openCard, path, stream.cards.length]);

  return (
    <Stream
      path={path}
      stream={stream}
      onOpenSearch={handleOpenSearch}
    />
  );
};
