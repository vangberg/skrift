import { NoteID, Note } from "./interfaces/note";

export type IpcLoadNote = { path: string; id: NoteID };
export type IpcLoadedNote = { note: Note };
export type IpcSetNote = { path: string; id: NoteID; markdown: string };
