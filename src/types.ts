import { NoteID, Note } from "./interfaces/note";
import { Node } from "slate";

export type IpcLoadedDir = { notes: Note[] };

export type IpcLoadNote = { path: string; id: NoteID };
export type IpcLoadedNote = { note: Note };

export type IpcSetNote = { path: string; id: NoteID; slate: Node[] };
