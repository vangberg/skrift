import { StateEffectPair } from "react-use-elmish";

import { NoteID } from "../interfaces/note";
import { Streams, StreamIndex, StreamLocation } from "../interfaces/streams";

export interface State {
  streams: Streams;
}

export type ErrorAction = { type: "ERROR"; message: string };

export type OpenSearchAction = {
  type: "streams/OPEN_SEARCH";
  stream: StreamIndex;
};

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

export type StreamsAction =
  | OpenSearchAction
  | OpenNoteAction
  | CloseNoteAction
  | MoveNoteAction;

export type Action = StreamsAction | ErrorAction;

export type ActionHandler<SubAction> = (
  state: State,
  action: SubAction
) => StateEffectPair<State, Action>;
