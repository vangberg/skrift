import clsx from "clsx";
import React, { useCallback, useMemo } from "react";
import { StreamContainer } from "../containers/StreamContainer";
import { Path } from "../interfaces/path";
import { WorkspaceCard } from "../interfaces/state";

type Props = {
  path: Path;
  card: WorkspaceCard;
  onZoomOut: () => void;
};

export const Workspace: React.FC<Props> = ({ path, card, onZoomOut }) => {
  const { zoom } = card;

  const handleZoomOut = useCallback(() => onZoomOut(), [onZoomOut]);

  // We want to hide the workspace UNLESS it is the one that is currently
  // visible. Otherwise the <Droppable>'s of the different workspaces are
  // overlapping, which isn't supported. This is achieved by checking
  // whether any child workspaces are zoomed.
  const isLastZoom = useMemo(
    () =>
      zoom &&
      !card.streams.some((stream) =>
        stream.cards.some((card) => card.type === "workspace" && card.zoom)
      ),
    [zoom, card]
  );

  return (
    <div
      className={clsx(
        "fixed top-0 bottom-0 left-0 right-0 h-screen flex-1 flex flex-col bg-gray-200 text-sm",
        { hidden: !isLastZoom }
      )}
    >
      {Path.isRoot(path) || (
        <div className="flex-none flex justify-center pt-2">
          <span
            onClick={handleZoomOut}
            className="p-1 text-gray-500 hover:bg-gray-500 hover:text-white rounded cursor-pointer select-none"
          >
            Zoom out
          </span>
        </div>
      )}

      <div className="flex-1 flex flex-row h-0 justify-center px-1">
        {card.streams.map((stream, index) => (
          <StreamContainer
            key={stream.key}
            path={[...path, index]}
            stream={stream}
          />
        ))}
      </div>
    </div>
  );
};
