import React, { useContext, useCallback } from "react";
import { StateContext } from "../state";
import { NoteID } from "../interfaces/note";
import { StreamLocation } from "../interfaces/streams";
import { StreamSearch } from "../components/StreamSearch";

interface Props {
  query: string;
  results: NoteID[];
  location: StreamLocation;
}

export const StreamSearchContainer: React.FC<Props> = ({
  query,
  results,
  location,
}) => {
  const [, dispatch] = useContext(StateContext);
  const [stream] = location;

  const handleClose = useCallback(
    () => dispatch({ type: "streams/CLOSE_NOTE", location }),
    [dispatch, location]
  );

  return (
    <StreamSearch
      location={location}
      onAdd={() => {}}
      onOpen={() => {}}
      onClose={handleClose}
      onSearch={() => {}}
      query={query}
      results={results}
    />
  );
};
