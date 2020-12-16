import clsx from "clsx";
import React, { useCallback } from "react";
import { StreamsContainer } from "../containers/StreamsContainer";

type Props = {
  hidden?: boolean;
  onZoomOut?: () => void;
};

export const Workspace: React.FC<Props> = ({ hidden, onZoomOut }) => {
  const handleZoomOut = useCallback(() => {
    if (onZoomOut) onZoomOut();
  }, [onZoomOut]);

  return (
    <div
      className={clsx(
        "fixed top-0 bottom-0 left-0 right-0 h-screen flex-1 flex flex-col bg-gray-200 text-sm",
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
        <StreamsContainer />
      </div>
    </div>
  );
};
