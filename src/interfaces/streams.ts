import { NoteID } from "./note";

let key = 0;

export type StreamID = number;

// We need a key that can be used by React when rendering a stream.
export type StreamEntry = {
  key: number;
  noteId: NoteID;
};

export type Stream = StreamEntry[];
export type Streams = Stream[];
export type StreamIndex = number;
export type StreamNoteIndex = number;
export type StreamLocation = [StreamIndex, StreamNoteIndex];

export const Streams = {
  at(streams: Streams, idx: StreamIndex): Stream {
    if (!streams[idx]) {
      streams[idx] = [];
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
    return streams[idx].length === 0;
  },

  close(streams: Streams, idx: StreamIndex) {
    streams.splice(idx, 1);
  },

  openNote(streams: Streams, streamIdx: StreamIndex, noteId: NoteID) {
    Streams.at(streams, streamIdx).push({
      key: key++,
      noteId,
    });
  },

  closeNote(streams: Streams, location: StreamLocation) {
    const [streamIdx, noteIdx] = location;
    Streams.at(streams, streamIdx).splice(noteIdx, 1);

    // If this was the last note in the stream, close the stream itself.
    if (Streams.isEmpty(streams, streamIdx)) {
      Streams.close(streams, streamIdx);
    }
  },

  move(streams: Streams, from: StreamLocation, to: StreamLocation) {
    if (from[0] === to[0]) {
      // Reordering within the same stream
      const stream = streams[from[0]];
      const [removed] = stream.splice(from[1], 1);
      stream.splice(to[1], 0, removed);
    } else {
      // Move from one stream to another
      const fromStream = streams[from[0]];
      const toStream = streams[to[0]];
      const [removed] = fromStream.splice(from[1], 1);
      toStream.splice(to[1], 0, removed);
    }
  },
};
