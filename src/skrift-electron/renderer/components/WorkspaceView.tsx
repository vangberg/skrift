import clsx from "clsx";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { StreamContainer } from "../containers/StreamContainer";
import { usePrevious } from "../hooks/usePrevious";
import { Path } from "../interfaces/path";
import { WorkspaceCard } from "../interfaces/state";

type Props = {
  path: Path;
  card: WorkspaceCard;
  onZoomOut: () => void;
};

export const WorkspaceView: React.FC<Props> = ({ path, card, onZoomOut }) => {
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

  const wasZoomed = usePrevious(zoom);

  const [hidden, setHidden] = useState(!zoom);
  const [visible, setVisible] = useState(zoom);

  useEffect(() => {
    // If the workspace is the last zoom, it has just been zoomed into.
    if (isLastZoom) {
      // Set `display: block` immediately.
      setHidden(false);

      // In next tick, i.e. after `display` has been set, trigger fade-in
      // transition.
      setImmediate(() => setVisible(true));
    }
  }, [isLastZoom]);

  useEffect(() => {
    // If the workspace was zoomed, but isn't now, it has just been zoomed
    // out of.
    if (wasZoomed && !zoom) {
      // Trigger fade-out transition
      setVisible(false);
    }
  }, [wasZoomed, zoom]);

  return (
    <div
      className={clsx(
        "fixed flex-1 flex flex-col bg-gray-200 text-sm transition-opacity",

        // All of this could possibly be replaced by a set of linked transitions.

        // If the workspaces overlap, drag/drop will be mixed up. We cannot
        // use `display: block`, as that hinders any transitions. The
        // compromise is to make the hidden workspace into a 0x0 box with
        // hidden overflow
        hidden
          ? "h-0 w-0 overflow-hidden"
          : "top-0 bottom-0 left-0 right-0 h-screen",

        visible ? "opacity-90" : "opacity-10"
      )}
      onTransitionEnd={(e) => {
        // Whenever a transition ends, hide the workspace, unless it
        // is the currently zoomed workspace.
        if (!isLastZoom) {
          setHidden(true);
        }
      }}
    >
      <div className="flex-none flex justify-center pt-2">
        {Path.isRoot(path) || (
          <span
            onClick={handleZoomOut}
            className="p-1 text-gray-500 hover:bg-gray-500 hover:text-white rounded cursor-pointer select-none"
          >
            Zoom out
          </span>
        )}
      </div>

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
