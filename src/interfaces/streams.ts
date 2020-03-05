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

  openNote(streams: Streams, streamIdx: StreamIndex, noteId: NoteID) {
    Streams.at(streams, streamIdx).push(noteId);
  },

  closeNote(streams: Streams, location: StreamLocation) {
    const [streamIdx, noteIdx] = location;
    Streams.at(streams, streamIdx).splice(noteIdx, 1);
  }
};
