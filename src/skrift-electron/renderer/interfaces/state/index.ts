import { NoteID } from "../../../../skrift/note";
import { Path } from "../path";

export interface State {
  workspace: WorkspaceCard;
}

export interface Stream {
  key: number;
  type: "stream";
  cards: Card[];
}

export const Stream = {
  isStream(card: any): card is Stream {
    return card.type && card.type === "stream";
  },
};

export type Card = WorkspaceCard | NoteCard | SearchCard;

export const Card = {
  isCard(card: any): card is Card {
    return (
      card.type &&
      (card.type === "workspace" ||
        card.type === "note" ||
        card.type === "search")
    );
  },
};

export interface WorkspaceCard {
  key: number;
  type: "workspace";
  streams: Stream[];
}

export interface NoteCard {
  key: number;
  type: "note";
  id: NoteID;
}

export interface SearchCard {
  key: number;
  type: "search";
  query: string;
}

export const State = {
  at(state: State, path: Path): Card | Stream {
    let entry: Card | Stream = state.workspace;

    for (let i = 0; i < path.length; i++) {
      if (entry.type === "workspace") {
        entry = entry.streams[path[i]];
      } else if (entry.type === "stream") {
        entry = entry.cards[path[i]];
      }
    }

    return entry;
  },

  move(state: State, from: Path, to: Path) {
    const fromElem = State.at(state, from);

    // We can only move cards, not streams.
    if (!Card.isCard(fromElem)) {
      return;
    }

    const fromStream = State.at(state, Path.ancestor(from));
    const toStream = State.at(state, Path.ancestor(to));

    if (!Stream.isStream(fromStream) || !Stream.isStream(toStream)) {
      return;
    }

    const [removed] = fromStream.cards.splice(Path.last(from), 1);
    toStream.cards.splice(Path.last(to), 0, removed);
  },
};
