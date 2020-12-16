import React, { useCallback, useState } from "react";
import { StreamLocation, StreamWorkspaceCard } from "../interfaces/streams";
import { WorkspaceCard } from "../components/WorkspaceCard";
import { Workspace } from "../components/Workspace";
import { StreamsContext, useStreams } from "../hooks/useStreams";

interface Props {
  location: StreamLocation;
  card: StreamWorkspaceCard;
}

export const WorkspaceCardContainer: React.FC<Props> = ({ location, card }) => {
  const [streams, actions] = useStreams();

  const [zoom, setZoom] = useState(false);

  const handleZoomIn = useCallback(() => {
    setZoom(true);
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom(false);
  }, []);

  return (
    <StreamsContext.Provider value={[streams, actions]}>
      <Workspace hidden={!zoom} onZoomOut={handleZoomOut} />
      <WorkspaceCard
        streams={streams}
        location={location}
        onZoom={handleZoomIn}
      />
    </StreamsContext.Provider>
  );
};
