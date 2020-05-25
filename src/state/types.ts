import { StateEffectPair } from "react-use-elmish";

import { NoteID } from "../interfaces/note";
import { Streams, StreamIndex, StreamLocation } from "../interfaces/streams";

export interface State {
  path: string;
  streams: Streams;
  search: {
    query: string;
    results: NoteID[] | null;
  };
}

export type ErrorAction = { type: "ERROR"; message: string };

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

export type Action = StreamsAction | SearchAction | ErrorAction;

export type ActionHandler<SubAction> = (
  state: State,
  action: SubAction
) => StateEffectPair<State, Action>;
