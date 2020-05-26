import { NoteID, Note } from "./interfaces/note";

export type IpcLoadNote = { path: string; id: NoteID };
export type IpcLoadedNote = { note: Note };
