import React from "react";
import { Updater } from "use-immer";
import { NoteID } from "../../../../skrift/note";
import { Path } from "../path";

export interface State {
  streams: Stream[];
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

export type Card = NoteCard | SearchCard;

export const Card = {
  isCard(card: any): card is Card {
    return card.type && (Card.isNote(card) || Card.isSearch(card));
  },

  isNote(card: Card): card is NoteCard {
    return card.type === "note";
  },

  isSearch(card: Card): card is SearchCard {
    return card.type === "search";
  },
};

export interface CardMeta {
  key: number;
  collapsed: boolean;
}
export interface NoteCard {
  meta: CardMeta;
  type: "note";
  id: NoteID;
}

export interface SearchCard {
  meta: CardMeta;
  type: "search";
  query: string;
}

type CloseOptions =
  | { path: Path; match?: never }
  | { match: Partial<Card>; path?: never };

export type OpenCardMode = "below" | "push" | "replace";

type OpenCard = Omit<NoteCard, "meta"> | Omit<SearchCard, "meta">;

let key = 0;

export const State = {
  initial(): State {
    return {
      streams: [
        {
          key: key++,
          type: "stream",
          cards: [],
        },
      ],
    };
  },

  openStream(state: State) {
    state.streams.push({
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

    const stream = state.streams[Path.stream(path)];

    const card = { meta: { key: key++, collapsed: false }, ...props };

    if (mode === "below") {
      stream.cards.push(card);

      return;
    }

    if (mode === "push") {
      // Prepend the card to the next stream, creating the stream
      // if it does not exist.

      const nextPath = Path.next(Path.streamPath(path));

      // If the card is pushed from the last stream, open a new stream.
      if (Path.stream(nextPath) >= state.streams.length) {
        State.openStream(state);
      }

      const nextStream = state.streams[Path.stream(nextPath)];

      nextStream.cards.unshift(card);

      return;
    }

    if (mode === "replace") {
      // Replace the card at the path with the new card.
      stream.cards.splice(Path.last(path), 1, card);

      return;
    }
  },

  updateCard<T extends Card>(state: State, path: Path, props: Partial<T>) {
    if (!Path.isCardPath(path)) return;

    const stream = state.streams[Path.stream(path)];
    const card = stream.cards[Path.card(path)];

    const idx = Path.last(path);

    stream.cards[idx] = { ...card, ...props };
  },

  updateMeta<T extends Card>(
    state: State,
    path: Path,
    props: Partial<CardMeta>
  ) {
    if (!Path.isCardPath(path)) return;

    const stream = state.streams[Path.stream(path)];
    const card = stream.cards[Path.card(path)];

    stream.cards[Path.card(path)].meta = { ...card.meta, ...props };
  },

  move(state: State, from: Path, to: Path) {
    // We can only move cards, not streams.
    if (!Path.isCardPath(from)) return;

    const fromStream = state.streams[Path.stream(from)];

    const toStreamPath = Path.stream(to);

    // If the index of the destination stream is negative, it means that
    // the card was drag and dropped to the left of the first stream, so
    // we insert a new stream at the beginning.
    if (toStreamPath < 0) {
      const [removed] = fromStream.cards.splice(Path.last(from), 1);

      state.streams.unshift({
        type: "stream",
        key: key++,
        cards: [removed],
      });

      State.normalize(state);

      return;
    }

    // If the index of the destination stream is larger than the number
    // of streams, it means that the card was drag and
    // dropped to the right of the last stream, so we insert a new stream
    // at the end.
    if (toStreamPath > state.streams.length - 1) {
      const [removed] = fromStream.cards.splice(Path.last(from), 1);

      state.streams.push({
        type: "stream",
        key: key++,
        cards: [removed],
      });

      State.normalize(state);

      return;
    }

    // Otherwise, the card was moved between existing streams.
    const toStream = state.streams[Path.stream(to)];

    const [removed] = fromStream.cards.splice(Path.last(from), 1);
    toStream.cards.splice(Path.last(to), 0, removed);

    State.normalize(state);
  },

  close(state: State, options: CloseOptions) {
    if (options.path) {
      const { path } = options;

      if (Path.isCardPath(path)) {
        const stream = state.streams[Path.stream(path)];
        stream.cards.splice(Path.card(path), 1);
      } else {
        state.streams.splice(Path.stream(path), 1);
      }
    } else {
      const { match } = options;

      state.streams.forEach((stream) => {
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
          }
        }
      });
    }

    State.normalize(state);
  },

  /* normalizeOnce perform exactly one normalization, and returns true. If no
  normalization were needed, they return false. This allows the normalization
  pass to do destructive things to i.e. arrays, without thinking too much over
  it. We simply call it repeatedly until there is nothing left to do. */
  normalize(state: State) {
    while (State.normalizeOnce(state)) {
      null;
    }
  },

  normalizeOnce(state: State): boolean {
    const { streams } = state;

    // There should always be at least 1 stream.
    if (streams.length === 0) {
      streams.push({
        key: key++,
        type: "stream",
        cards: [],
      });
      return true;
    }

    // We always want at least 1 stream, empty or not.
    if (streams.length === 1) return false;

    // Find the first empty stream and remove it.
    streams.forEach((stream, index) => {
      if (stream.cards.length === 0) {
        streams.splice(index, 1);
        return true;
      }
    });

    return false;
  },
};

interface StateActions {
  openCard: (path: Path, mode: OpenCardMode, card: OpenCard) => void;
  updateCard: <T extends Card>(path: Path, card: Partial<T>) => void;
  updateMeta: (path: Path, card: Partial<CardMeta>) => void;
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
    updateMeta(path: Path, props: Partial<CardMeta>) {
      setState((draft) => {
        State.updateMeta(draft, path, props);
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
