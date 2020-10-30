import { NoteID } from "./note";

let key = 0;

export type StreamID = number;

export type StreamCardMeta = {
  // We need a key that can be used by React when rendering a stream.
  key: number;
};

export type StreamNoteCard = {
  type: "note";
  id: NoteID;
};

export type StreamSearchCard = {
  type: "search";
  query: string;
  results: NoteID[];
};

export type StreamCard = StreamCardMeta & (StreamNoteCard | StreamSearchCard);

export type Stream = {
  // We need a key that can be used by React when rendering a stream.
  key: number;
  cards: StreamCard[];
};

export type Streams = Stream[];
export type StreamIndex = number;
export type StreamCardIndex = number;
export type StreamLocation = [StreamIndex, StreamCardIndex];

export const Streams = {
  at(streams: Streams, idx: StreamIndex): Stream {
    if (!streams[idx]) {
      streams[idx] = { key: key++, cards: [] };
    }

    return streams[idx];
  },

  next(streams: Streams): StreamIndex {
    return streams.length;
  },

  last(streams: Streams): StreamIndex {
    return Math.max(streams.length - 1, 0);
  },

  isEmpty(streams: Streams, idx: StreamIndex): boolean {
    return Streams.at(streams, idx).cards.length === 0;
  },

  close(streams: Streams, idx: StreamIndex) {
    streams.splice(idx, 1);
  },

  openNote(streams: Streams, streamIdx: StreamIndex, id: NoteID) {
    Streams.at(streams, streamIdx).cards.push({
      key: key++,
      type: "note",
      id,
    });
  },

  openSearch(streams: Streams, streamIdx: StreamIndex) {
    Streams.at(streams, streamIdx).cards.push({
      key: key++,
      type: "search",
      query: "",
      results: [],
    });
  },

  closeNote(
    streams: Streams,
    options: { location?: StreamLocation; id?: NoteID }
  ) {
    if (options.location) {
      const [streamIdx, noteIdx] = options.location;
      Streams.at(streams, streamIdx).cards.splice(noteIdx, 1);
    }

    if (options.id) {
      streams.forEach((stream, idx) => {
        streams[idx].cards = stream.cards.filter(
          (entry) => entry.type === "note" && entry.id !== options.id
        );
      });
    }

    Streams.collapse(streams);
  },

  move(streams: Streams, from: StreamLocation, to: StreamLocation) {
    if (from[0] === to[0]) {
      // Reordering within the same stream
      const stream = streams[from[0]];
      const [removed] = stream.cards.splice(from[1], 1);
      stream.cards.splice(to[1], 0, removed);
    } else {
      // Move from one stream to another
      const fromStream = streams[from[0]];
      // Create stream if it doesn't exist
      const toStream = Streams.at(streams, to[0]);
      const [removed] = fromStream.cards.splice(from[1], 1);
      toStream.cards.splice(to[1], 0, removed);
    }

    Streams.collapse(streams);
  },

  collapse(streams: Streams) {
    for (let i = streams.length - 1; i >= 0; i--) {
      if (Streams.isEmpty(streams, i)) {
        Streams.close(streams, i);
      }
    }
  },
};
