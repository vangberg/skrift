import { NoteID } from "./note";

export type StreamID = number;
export type Stream = NoteID[];
export type Streams = Stream[];

export const Streams = {
  openNote(streams: Streams, stream: StreamID, note: NoteID) {}
};
