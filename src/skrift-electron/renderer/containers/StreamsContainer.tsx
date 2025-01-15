import React, { useContext } from "react";
import { StateContext } from "../interfaces/state/index.js";
import { Streams } from "../components/Streams.js";

export const StreamsContainer: React.FC = () => {
  const [{ streams }] = useContext(StateContext);

  return <Streams streams={streams} />;
};
