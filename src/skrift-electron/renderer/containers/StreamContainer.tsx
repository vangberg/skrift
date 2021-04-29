import React, { useCallback, useContext } from "react";
import { Stream } from "../components/Stream";
import {
  Stream as StreamType,
  StateContext,
  OpenCardMode,
} from "../interfaces/state";
import { Path, StreamPath } from "../interfaces/path";

interface Props {
  path: StreamPath;
  stream: StreamType;
}

export const StreamContainer: React.FC<Props> = ({ path, stream }) => {
  const [, { openCard, updateMeta }] = useContext(StateContext);

  const { cards } = stream;

  const handleOpenSearch = useCallback(
    (query: string, mode: OpenCardMode) =>
      openCard(path, mode, { type: "search", query: query || "" }),
    [openCard, path]
  );

  const handleMinimizeAll = useCallback(() => {
    cards.forEach((card, idx) => {
      updateMeta([...path, idx], { collapsed: true });
    });
  }, [updateMeta, cards, path]);

  const handleMaximizeAll = useCallback(() => {
    cards.forEach((card, idx) => {
      updateMeta([...path, idx], { collapsed: false });
    });
  }, [updateMeta, cards, path]);

  return (
    <Stream
      path={path}
      stream={stream}
      onOpenSearch={handleOpenSearch}
      onMinimizeAll={handleMinimizeAll}
      onMaximizeAll={handleMaximizeAll}
    />
  );
};
