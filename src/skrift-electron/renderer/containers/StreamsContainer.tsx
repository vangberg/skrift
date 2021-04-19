import React, { useContext } from "react";
import { StateContext } from "../interfaces/state";
import { Streams } from "../components/Streams";

export const StreamsContainer: React.FC = () => {
  const [{ streams }] = useContext(StateContext);

  return <Streams streams={streams} />;
};
