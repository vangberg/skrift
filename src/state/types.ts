import { StateEffectPair } from "react-use-elmish";

import { NoteID, Note } from "../interfaces/note";
import { Streams, StreamIndex, StreamLocation } from "../interfaces/streams";

export interface NoteCacheEntry {
  id: NoteID;
  title: string;
  modifiedAt: Date;
}

export type NoteCache = Map<NoteID, NoteCacheEntry>;

export interface State {
  path: string;
  notes: NoteCache;
  streams: Streams;
  search: {
    query: string;
    results: NoteID[] | null;
  };
}

export type ErrorAction = { type: "ERROR"; message: string };

export type SetNotesAction = { type: "notes/SET_NOTES"; notes: Note[] };

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

export type Action =
  | SetNotesAction
  | StreamsAction
  | SearchAction
  | ErrorAction;

export type ActionHandler<SubAction> = (
  state: State,
  action: SubAction
) => StateEffectPair<State, Action>;
