import React, { useCallback, useState } from "react";
import { WorkspaceCard } from "../components/WorkspaceCard";
import { Workspace } from "../components/Workspace";
import { Path } from "../interfaces/path";
import { WorkspaceCard as WorkspaceCardType } from "../interfaces/state";

interface Props {
  path: Path;
  card: WorkspaceCardType;
}

export const WorkspaceCardContainer: React.FC<Props> = ({ path, card }) => {
  const [zoom, setZoom] = useState(false);

  const handleZoomIn = useCallback(() => {
    setZoom(true);
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom(false);
  }, []);

  return (
    <>
      <Workspace
        path={path}
        card={card}
        hidden={!zoom}
        onZoomOut={handleZoomOut}
      />
      <WorkspaceCard card={card} path={path} onZoom={handleZoomIn} />
    </>
  );
};
