import { NoteID, Note } from "./interfaces/note";
import { Node } from "slate";

export type IpcLoadedDir = { notes: Note[] };

export type IpcLoadNote = { id: NoteID };
export type IpcLoadedNote = { note: Note };

export type IpcSetNote = { id: NoteID; slate: Node[] };

export type IpcDeleteNote = { id: NoteID };

export type IpcSearch = { query: string };
export type IpcSearchResults = { ids: NoteID[] };

export type IpcMessage =
  | { type: "command/LOAD_DIR"; path: string }
  | { type: "command/ADD_NOTE"; id: NoteID; slate: Node[] }
  | { type: "command/DELETE_NOTE"; id: NoteID }
  | { type: "command/UPDATE_NOTE"; id: NoteID; slate: Node[] }
  | { type: "command/LOADED_DIR"; notes: Note[] }
  | { type: "event/ADDED_NOTE"; id: NoteID; slate: Node[] }
  | { type: "event/DELETED_NOTE"; id: NoteID }
  | { type: "event/UPDATED_NOTE"; id: NoteID; slate: Node[] }
  | { type: "event/ADDED_LINK"; from: NoteID; to: NoteID }
  | { type: "event/DELETED_LINK"; from: NoteID; to: NoteID };
