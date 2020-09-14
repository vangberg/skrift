import { StateEffectPair } from "react-use-elmish";

import { NoteID, Note } from "../interfaces/note";
import { Streams, StreamIndex, StreamLocation } from "../interfaces/streams";
import { NoteCache } from "../interfaces/noteCache";

export interface State {
  notes: NoteCache;
  streams: Streams;
  search: {
    query: string;
    results: NoteID[] | null;
  };
}

export type ErrorAction = { type: "ERROR"; message: string };

export type NotesAction = SetNotesAction | SetNoteAction | DeleteNoteAction;
export type SetNotesAction = { type: "notes/SET_NOTES"; notes: Note[] };
export type SetNoteAction = { type: "notes/SET_NOTE"; note: Note };
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
