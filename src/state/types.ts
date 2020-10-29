import { StateEffectPair } from "react-use-elmish";

import { NoteID, Note } from "../interfaces/note";
import { Streams, StreamIndex, StreamLocation } from "../interfaces/streams";

export interface State {
  streams: Streams;
  search: {
    query: string;
    results: NoteID[];
  };
}

export type ErrorAction = { type: "ERROR"; message: string };

export type StreamsAction = OpenNoteAction | CloseNoteAction | MoveNoteAction;
export type OpenNoteAction = {
  type: "streams/OPEN_NOTE";
  stream: StreamIndex;
  id: NoteID;
};
export type CloseNoteAction = {
  type: "streams/CLOSE_NOTE";
  location: StreamLocation;
};
export type MoveNoteAction = {
  type: "streams/MOVE_NOTE";
  from: StreamLocation;
  to: StreamLocation;
};

export type SearchAction = SetQueryAction | SetResultsAction;
export type SetQueryAction = { type: "search/SET_QUERY"; query: string };
export type SetResultsAction = {
  type: "search/SET_RESULTS";
  results: NoteID[];
};

export type Action = StreamsAction | SearchAction | ErrorAction;

export type ActionHandler<SubAction> = (
  state: State,
  action: SubAction
) => StateEffectPair<State, Action>;
