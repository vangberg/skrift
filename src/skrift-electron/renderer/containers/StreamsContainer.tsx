import React, { useCallback, useContext } from "react";
import { StateContext } from "../interfaces/state/index.js";
import { Streams } from "../components/Streams.js";

export const StreamsContainer: React.FC = () => {
  const [{ streams }, { openCard }] = useContext(StateContext);

  const handleOpenSearch = useCallback(() => {
    openCard([streams.length - 1], "push", {
      type: "search",
      query: "",
    });
  }, [openCard, streams]);

  return <Streams streams={streams} onOpenSearch={handleOpenSearch} />;
};
