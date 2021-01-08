import React, { useCallback, useContext } from "react";
import { WorkspaceCard } from "../components/WorkspaceCard";
import { Workspace } from "../components/Workspace";
import { Path } from "../interfaces/path";
import {
  StateContext,
  WorkspaceCard as WorkspaceCardType,
} from "../interfaces/state";

interface Props {
  path: Path;
  card: WorkspaceCardType;
}

export const WorkspaceCardContainer: React.FC<Props> = ({ path, card }) => {
  const [, { updateCard }] = useContext(StateContext);

  const handleZoomIn = useCallback(() => {
    updateCard(path, { zoom: true });
  }, [updateCard, path]);

  const handleZoomOut = useCallback(() => {
    updateCard(path, { zoom: false });
  }, [updateCard, path]);

  return (
    <>
      <Workspace path={path} card={card} onZoomOut={handleZoomOut} />
      {Path.isRoot(path) || (
        <WorkspaceCard card={card} path={path} onZoom={handleZoomIn} />
      )}
    </>
  );
};
