import React, { useCallback, useContext } from "react";
import { WorkspaceCard } from "../components/WorkspaceCard";
import { Workspace } from "../components/Workspace";
import { Path } from "../interfaces/path";
import {
  StateContext,
  WorkspaceCard as WorkspaceCardType,
} from "../interfaces/state";
import { useCardActions } from "../hooks/useCardActions";

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

  return (
    <>
      <Workspace path={path} card={card} onZoomOut={handleZoomOut} />
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
