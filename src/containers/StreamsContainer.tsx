import React, { useContext } from "react";
import { StateContext } from "../state";
import { Streams } from "../components/Streams";

export const StreamsContainer: React.FC = () => {
  const [state] = useContext(StateContext);
  const { streams } = state;

  return <Streams streams={streams} />;
};
