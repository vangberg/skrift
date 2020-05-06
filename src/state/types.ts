import { Database } from "sqlite";
import { StateEffectPair } from "react-use-elmish";

import { Notes } from "../interfaces/notes";
import { NoteID } from "../interfaces/note";
import { Index } from "../search";
import { Streams, StreamIndex, StreamLocation } from "../interfaces/streams";

export interface State {
  db: Database;
  notes: Notes;
  streams: Streams;
  search: {
    index: Index;
    query: string;
    results: NoteID[] | null;
  };
}

export type ErrorAction = { type: "ERROR"; message: string };

export type NotesAction =
  | OpenFolderAction
  | SetNotesAction
  | SaveMarkdownAction
  | DeleteNoteAction;
export type OpenFolderAction = { type: "notes/OPEN_FOLDER" };
export type SetNotesAction = { type: "notes/SET_NOTES"; notes: Notes };
export type SaveMarkdownAction = {
  type: "notes/SAVE_MARKDOWN";
  id: NoteID;
  markdown: string;
};
export type DeleteNoteAction = { type: "notes/DELETE_NOTE"; id: NoteID };

export type StreamsAction = OpenNoteAction | CloseNoteAction;
export type OpenNoteAction = {
  type: "streams/OPEN_NOTE";
  stream: StreamIndex;
  id: NoteID;
};
export type CloseNoteAction = {
  type: "streams/CLOSE_NOTE";
  location: StreamLocation;
};

export type SearchAction =
  | SetQueryAction
  | SetResultsAction
  | ClearSearchAction;
export type SetQueryAction = { type: "search/SET_QUERY"; query: string };
export type SetResultsAction = {
  type: "search/SET_RESULTS";
  results: NoteID[];
};
export type ClearSearchAction = { type: "search/CLEAR" };

export type Action = NotesAction | StreamsAction | SearchAction | ErrorAction;

export type ActionHandler<SubAction> = (
  state: State,
  action: SubAction
) => StateEffectPair<State, Action>;
