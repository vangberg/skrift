import React from "react";
import { Updater } from "use-immer";
import { NoteID } from "../../../../skrift/note/index.js";
import { Path } from "../path/index.js";

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

export type MoveMode = "before" | "after";

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
      if (Path.isCardPath(path)) {
        // If path is card path, open the new card below the card that
        // requested the card to be opened.
        stream.cards.splice(Path.card(path) + 1, 0, card);
        return;
      }

      // Otherwise, path is a stream path, in which case the card should
      // be opened at the top.
      stream.cards.unshift(card);
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

  dropOnCard(state: State, sourceKey: number, targetKey: number, mode: MoveMode) {
    if (sourceKey === targetKey) return;

    const sourcePath = Path.findByCardKey(state, sourceKey);
    if (!sourcePath) throw new Error("Source card not found");
    const fromStream = state.streams[Path.stream(sourcePath)];

    const [removed] = fromStream.cards.splice(Path.last(sourcePath), 1);

    const targetPath = Path.findByCardKey(state, targetKey)
    if (!targetPath) throw new Error("Target card not found");
    const toStream = state.streams[Path.stream(targetPath)];

    let targetStart: number;
    switch (mode) {
      case "before":
        targetStart = Path.last(targetPath);
        break;
      case "after":
        targetStart = Path.last(targetPath) + 1;
        break;
    }

    toStream.cards.splice(targetStart, 0, removed);

    State.normalize(state);
  },

  dropOnStream(state: State, sourceKey: number, targetStreamKey: number, mode: MoveMode) {
    const sourcePath = Path.findByCardKey(state, sourceKey);
    if (!sourcePath) throw new Error("Source card not found");

    const targetStreamIndex = state.streams.findIndex(s => s.key === targetStreamKey);
    if (targetStreamIndex === -1) throw new Error("Target stream not found");

    const fromStream = state.streams[Path.stream(sourcePath)];
    const [removed] = fromStream.cards.splice(Path.last(sourcePath), 1);

    const newStream: Stream = {
      type: "stream",
      key: key++,
      cards: [removed],
    };

    switch (mode) {
      case "before":
        state.streams.splice(targetStreamIndex, 0, newStream);
        break;
      case "after":
        state.streams.splice(targetStreamIndex + 1, 0, newStream);
        break;
    }

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
  dropOnCard: (sourceKey: number, targetKey: number, mode: MoveMode) => void;
  dropOnStream: (sourceKey: number, targetStreamKey: number, mode: MoveMode) => void;
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
    dropOnCard(sourceKey: number, targetKey: number, mode: MoveMode) {
      setState((draft) => {
        State.dropOnCard(draft, sourceKey, targetKey, mode);
      });
    },
    dropOnStream(sourceKey: number, targetStreamKey: number, mode: MoveMode) {
      setState((draft) => {
        State.dropOnStream(draft, sourceKey, targetStreamKey, mode);
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
  createStateActions(() => { }),
]);
