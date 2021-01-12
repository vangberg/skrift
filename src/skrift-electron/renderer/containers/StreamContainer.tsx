import React, { useCallback, useContext } from "react";
import { Stream } from "../components/Stream";
import {
  Stream as StreamType,
  StateContext,
  OpenCardMode,
} from "../interfaces/state";
import { Path } from "../interfaces/path";

interface Props {
  path: Path;
  stream: StreamType;
}

export const StreamContainer: React.FC<Props> = ({ path, stream }) => {
  const [, { openCard }] = useContext(StateContext);

  const handleOpenSearch = useCallback(
    (query: string, mode: OpenCardMode) =>
      openCard(path, mode, { type: "search", query: query || "" }),
    [openCard, path]
  );

  return <Stream path={path} stream={stream} onOpenSearch={handleOpenSearch} />;
};
