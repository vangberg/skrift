import React from "react";
import { useMemo } from "react";
import { useImmer } from "use-immer";
import { NoteID } from "./interfaces/note";
import { StreamIndex, StreamLocation, Streams } from "./interfaces/streams";

interface StreamActions {
  openSearch: (streamIdx: StreamIndex) => void;
  openNote: (streamIdx: StreamIndex, noteId: NoteID) => void;
  closeNote: (location: StreamLocation) => void;
  moveNote: (from: StreamLocation, to: StreamLocation) => void;
}

export const StreamsContext = React.createContext<[Streams, StreamActions]>([
  [],
  {
    openSearch: () => {},
    openNote: () => {},
    closeNote: () => {},
    moveNote: () => {},
  },
]);

export const useStreams = (): [Streams, StreamActions] => {
  const [streams, setStreams] = useImmer([]);

  const actions: StreamActions = useMemo(
    () => ({
      openSearch: (idx) => {
        setStreams((draft) => {
          Streams.openSearch(draft, idx);
        });
      },
      openNote: (streamIdx, noteId) => {
        setStreams((draft) => {
          Streams.openNote(draft, streamIdx, noteId);
        });
      },
      closeNote: (location) => {
        setStreams((draft) => {
          Streams.closeNote(draft, { location });
        });
      },
      moveNote: (from, to) => {
        setStreams((draft) => {
          Streams.move(draft, from, to);
        });
      },
    }),
    [setStreams]
  );

  return [streams, actions];
};
