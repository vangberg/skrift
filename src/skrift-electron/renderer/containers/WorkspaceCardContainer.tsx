import React, { useCallback, useContext, useEffect, useRef } from "react";
import { WorkspaceCard } from "../components/WorkspaceCard";
import { Workspace } from "../components/Workspace";
import { Path } from "../interfaces/path";
import {
  StateContext,
  WorkspaceCard as WorkspaceCardType,
} from "../interfaces/state";
import { useCardActions } from "../hooks/useCardActions";
import ReactDOM from "react-dom";

interface Props {
  path: Path;
  card: WorkspaceCardType;
}

export const WorkspaceCardContainer: React.FC<Props> = ({ path, card }) => {
  const { onClose, onUpdate } = useCardActions(card, path);

  const handleZoomIn = useCallback(() => {
    onUpdate({ zoom: true });
  }, [onUpdate]);

  const handleZoomOut = useCallback(() => {
    onUpdate({ zoom: false });
  }, [onUpdate]);

  // Since react-beautiful-dnd doesn't support nested <Droppable>s, we need
  // to render each workspace in separate DOM elements. This is done by creating
  // a DOM element for each workspace outside of the React DOM, and rendering
  // the workspace into this DOM via React Portals.
  const portal = useRef<HTMLDivElement>();
  if (!portal.current) {
    const workspacesEl = document.getElementById("workspaces")!;
    portal.current = document.createElement("div");
    portal.current.id = `workspace-portal-${card.meta.key}`;
    workspacesEl.append(portal.current);
  }

  useEffect(
    () => () => {
      if (portal.current) {
        portal.current.remove();
      }
    },
    []
  );

  return (
    <>
      {ReactDOM.createPortal(
        <Workspace path={path} card={card} onZoomOut={handleZoomOut} />,
        portal.current
      )}
      {Path.isRoot(path) || (
        <WorkspaceCard
          card={card}
          path={path}
          onClose={onClose}
          onZoom={handleZoomIn}
        />
      )}
    </>
  );
};
