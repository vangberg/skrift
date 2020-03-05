import { NoteID } from "./note";

export type StreamID = number;
export type Stream = NoteID[];
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

  isEmpty(streams: Streams, idx: StreamIndex): boolean {
    return streams[idx].length === 0;
  },

  close(streams: Streams, idx: StreamIndex) {
    streams.splice(idx, 1);
  },

  openNote(streams: Streams, streamIdx: StreamIndex, noteId: NoteID) {
    Streams.at(streams, streamIdx).push(noteId);
  },

  closeNote(streams: Streams, location: StreamLocation) {
    const [streamIdx, noteIdx] = location;
    Streams.at(streams, streamIdx).splice(noteIdx, 1);

    // If this was the last note in the stream, close the stream itself.
    if (Streams.isEmpty(streams, streamIdx)) {
      Streams.close(streams, streamIdx);
    }
  }
};
