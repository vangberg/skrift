import { NoteID, Note } from "./interfaces/note";
import { Node } from "slate";

export type IpcAddNoteCommand = {
  type: "command/ADD_NOTE";
  id: NoteID;
  slate: Node[];
};
export type IpcLoadNoteCommand = { type: "command/LOAD_NOTE"; id: NoteID };
export type IpcSetNoteCommand = {
  type: "command/SET_NOTE";
  id: NoteID;
  slate: Node[];
};
export type IpcDeleteNoteCommand = { type: "command/DELETE_NOTE"; id: NoteID };
export type IpcSearchCommand = { type: "command/SEARCH"; query: string };

export type IpcCommand =
  | { type: "command/LOAD_DIR" }
  | IpcAddNoteCommand
  | IpcLoadNoteCommand
  | IpcSetNoteCommand
  | IpcDeleteNoteCommand
  | IpcSearchCommand;

export type IpcSetNoteEvent = { type: "event/SET_NOTE"; note: Note };
export type IpcSearchEvent = {
  type: "event/SEARCH";
  query: string;
  ids: NoteID[];
};

export type IpcReply =
  | { type: "event/LOADED_DIR"; notes: Note[] }
  | IpcSetNoteEvent
  | { type: "event/DELETED_NOTE"; id: NoteID }
  | { type: "event/ADDED_LINK"; from: NoteID; to: NoteID }
  | { type: "event/DELETED_LINK"; from: NoteID; to: NoteID }
  | IpcSearchEvent;
