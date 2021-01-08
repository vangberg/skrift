import clsx from "clsx";
import React, { useCallback } from "react";
import { StreamContainer } from "../containers/StreamContainer";
import { Path } from "../interfaces/path";
import { WorkspaceCard } from "../interfaces/state";

type Props = {
  path: Path;
  hidden?: boolean;
  onZoomOut?: () => void;
  card: WorkspaceCard;
};

export const Workspace: React.FC<Props> = ({
  path,
  card,
  hidden,
  onZoomOut,
}) => {
  const handleZoomOut = useCallback(() => {
    if (onZoomOut) onZoomOut();
  }, [onZoomOut]);

  return (
    <div
      className={clsx(
        "fixed top-0 bottom-0 left-0 right-0 h-screen flex-1 flex bg-gray-200 text-sm",
        { hidden }
      )}
    >
      {onZoomOut && (
        <div className="flex justify-center pt-2">
          <span
            onClick={handleZoomOut}
            className="p-1 text-gray-500 hover:bg-gray-500 hover:text-white rounded cursor-pointer select-none"
          >
            Zoom out
          </span>
        </div>
      )}

      <div className="flex-1 flex flex-row justify-center px-1">
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
