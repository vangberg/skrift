import { NoteID, NoteWithLinks } from "../../skrift/note/index.js";

export type IpcAddNoteCommand = {
  type: "command/ADD_NOTE";
  id: NoteID;
  markdown: string;
};
export type IpcLoadNoteCommand = { type: "command/LOAD_NOTE"; id: NoteID };
export type IpcSetNoteCommand = {
  type: "command/SET_NOTE";
  id: NoteID;
  markdown: string;
};
export type IpcDeleteNoteCommand = { type: "command/DELETE_NOTE"; id: NoteID };

export type IpcCommand =
  | { type: "command/LOAD_DIR" }
  | IpcAddNoteCommand
  | IpcLoadNoteCommand
  | IpcSetNoteCommand
  | IpcDeleteNoteCommand;

export type IpcSetNoteEvent = { type: "event/SET_NOTE"; note: NoteWithLinks };

export type IpcReply =
  | { type: "event/LOADING_DIR"; loaded: number }
  | { type: "event/LOADED_DIR"; initialNoteID: NoteID | null }
  | IpcSetNoteEvent
  | { type: "event/DELETED_NOTE"; id: NoteID }
  | { type: "event/ADDED_LINK"; from: NoteID; to: NoteID };
