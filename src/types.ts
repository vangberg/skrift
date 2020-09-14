import { NoteID, Note } from "./interfaces/note";
import { Node } from "slate";

export type IpcSearch = { query: string };
export type IpcSearchResults = { ids: NoteID[] };

export type IpcLoadNoteCommand = { type: "command/LOAD_NOTE"; id: NoteID };
export type IpcSetNoteCommand = {
  type: "command/SET_NOTE";
  id: NoteID;
  slate: Node[];
};
export type IpcDeleteNoteCommand = { type: "command/DELETE_NOTE"; id: NoteID };

export type IpcCommand =
  | { type: "command/LOAD_DIR" }
  | IpcLoadNoteCommand
  | IpcSetNoteCommand
  | IpcDeleteNoteCommand;

export type IpcSetNoteEvent = { type: "event/SET_NOTE"; note: Note };

export type IpcEvent =
  | { type: "event/LOADED_DIR"; notes: Note[] }
  | IpcSetNoteEvent
  | { type: "event/DELETED_NOTE"; id: NoteID }
  | { type: "event/ADDED_LINK"; from: NoteID; to: NoteID }
  | { type: "event/DELETED_LINK"; from: NoteID; to: NoteID };
