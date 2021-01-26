import produce from "immer";
import React from "react";
import { SetStateAction } from "react";
import { Updater } from "use-immer";
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
      (Card.isWorkspace(card) || Card.isNote(card) || Card.isSearch(card))
    );
  },

  isNote(card: Card): card is NoteCard {
    return card.type === "note";
  },

  isWorkspace(card: Card): card is WorkspaceCard {
    return card.type === "workspace";
  },

  isSearch(card: Card): card is SearchCard {
    return card.type === "search";
  },
};

export interface WorkspaceCard {
  key: number;
  type: "workspace";
  zoom: boolean;
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

type CloseOptions =
  | { path: Path; match?: never }
  | { match: Partial<Card>; path?: never };

export type OpenCardMode = "below" | "push" | "replace";

type OpenCard =
  | Omit<WorkspaceCard, "key">
  | Omit<NoteCard, "key">
  | Omit<SearchCard, "key">;

let key = 0;

export const State = {
  initial(): State {
    return {
      workspace: {
        key: key++,
        type: "workspace",
        zoom: true,
        streams: [
          {
            key: key++,
            type: "stream",
            cards: [],
          },
        ],
      },
    };
  },

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

  openStream(state: State, path: Path) {
    const workspace = State.at(state, path);

    if (!Card.isCard(workspace) || !Card.isWorkspace(workspace)) {
      return;
    }

    workspace.streams.push({
      key: key++,
      type: "stream",
      cards: [],
    });
  },

  openCard(
    state: State,
    path: Path,
    options: { mode: OpenCardMode },
    props: OpenCard
  ) {
    const { mode } = options;

    const atPath = State.at(state, path);

    let stream;

    if (Stream.isStream(atPath)) {
      stream = atPath;
      path = [...path, stream.cards.length - 1];
    } else if (Card.isCard(atPath)) {
      stream = State.at(state, Path.ancestor(path));
    }

    if (!Stream.isStream(stream)) {
      return;
    }

    const card = { key: key++, ...props };

    if (mode === "below") {
      stream.cards.push(card);

      return;
    }

    if (mode === "push") {
      // Append the card to the next stream, creating the stream
      // if it does not exist.

      const nextPath = Path.next(Path.ancestor(path));

      // If the stream does not exist, create it.
      if (!State.at(state, nextPath)) {
        State.openStream(state, Path.ancestor(nextPath));
      }

      const nextStream = State.at(state, Path.next(Path.ancestor(path)));

      if (!Stream.isStream(nextStream)) {
        return;
      }

      nextStream.cards.push(card);

      return;
    }

    if (mode === "replace") {
      // Replace the card at the path with the new card.
      stream.cards.splice(Path.last(path), 1, card);

      return;
    }
  },

  updateCard<T extends Card>(state: State, path: Path, props: Partial<T>) {
    const stream = State.at(state, Path.ancestor(path));

    if (!Stream.isStream(stream)) {
      return;
    }

    const card = State.at(state, path);

    if (!Card.isCard(card)) {
      return;
    }

    const idx = Path.last(path);

    stream.cards[idx] = { ...card, ...props };
  },

  zoomCard(state: State, path: Path) {
    const stream = State.at(state, Path.ancestor(path));

    if (!Stream.isStream(stream)) {
      return;
    }

    const card = State.at(state, path);

    if (!Card.isCard(card)) {
      return;
    }

    stream.cards[Path.last(path)] = {
      key: key++,
      type: "workspace",
      zoom: true,
      streams: [
        {
          key: key++,
          type: "stream",
          cards: [card],
        },
      ],
    };
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

    State.collapse(state);
  },

  close(state: State, options: CloseOptions) {
    if (options.path) {
      const { path } = options;
      const parent = State.at(state, Path.ancestor(path));

      if (Stream.isStream(parent)) {
        parent.cards.splice(Path.last(path), 1);
      } else if (Card.isWorkspace(parent)) {
        parent.streams.splice(Path.last(path), 1);
      }
    } else {
      const { match } = options;

      const closeInWorkspace = (
        workspace: WorkspaceCard,
        match: Partial<Card>
      ) => {
        workspace.streams.forEach((stream) => {
          // We iterate through cards from the end, so we can safely remove the cards.
          for (let i = stream.cards.length - 1; i >= 0; i--) {
            const card = stream.cards[i];
            if (
              Object.keys(match).every(
                (key) =>
                  card[key as keyof Partial<Card>] ===
                  match[key as keyof Partial<Card>]
              )
            ) {
              stream.cards.splice(i, 1);
            } else if (Card.isWorkspace(card)) {
              closeInWorkspace(card, match);
            }
          }
        });
      };

      closeInWorkspace(state.workspace, match);
    }

    State.collapse(state);
  },

  collapse(state: State) {
    const collapseInWorkspace = (workspace: WorkspaceCard) => {
      const { streams } = workspace;

      for (let i = streams.length - 1; i >= 0; i--) {
        const stream = streams[i];
        const { cards } = stream;

        if (cards.length === 0 && streams.length > 1) {
          streams.splice(i, 1);
        } else {
          cards.filter(Card.isWorkspace).forEach(collapseInWorkspace);
        }
      }
    };

    collapseInWorkspace(state.workspace);
  },
};

interface StateActions {
  openCard: (path: Path, mode: OpenCardMode, card: OpenCard) => void;
  updateCard: <T extends Card>(path: Path, card: Partial<T>) => void;
  zoomCard: (path: Path) => void;
  move: (from: Path, to: Path) => void;
  close: (options: CloseOptions) => void;
}

export const createStateActions = (setState: Updater<State>): StateActions => {
  return {
    openCard(path: Path, mode: OpenCardMode, card: OpenCard) {
      setState((draft) => {
        State.openCard(draft, path, { mode }, card);
      });
    },
    updateCard<T extends Card>(path: Path, props: Partial<T>) {
      setState((draft) => {
        State.updateCard(draft, path, props);
      });
    },
    zoomCard(path: Path) {
      setState((draft) => {
        State.zoomCard(draft, path);
      });
    },
    move(from: Path, to: Path) {
      setState((draft) => {
        State.move(draft, from, to);
      });
    },
    close(options: CloseOptions) {
      setState((draft) => {
        State.close(draft, options);
      });
    },
  };
};

export const StateContext = React.createContext<[State, StateActions]>([
  State.initial(),
  createStateActions(() => {}),
]);
