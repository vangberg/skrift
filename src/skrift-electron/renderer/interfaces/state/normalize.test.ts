import { State, Card, Stream, WorkspaceCard } from ".";
import { cardA, cardB, cardC, cardD, getState } from "./fixture";

describe("State.normalize", () => {
  it("ensures that workspace has at least one stream", () => {
    let state: State = {
      workspace: {
        meta: { key: 0, collapsed: false },
        type: "workspace",
        zoom: true,
        streams: [],
      },
    };

    State.normalize(state);

    expect(state.workspace.streams.length).toEqual(1);
  });

  it("does not collapse the last stream in the root workspace", () => {
    let state: State = {
      workspace: {
        meta: { key: 0, collapsed: false },
        type: "workspace",
        zoom: true,
        streams: [
          {
            key: 1,
            type: "stream",
            cards: [],
          },
        ],
      },
    };

    State.normalize(state);

    expect(state.workspace.streams.length).toEqual(1);
  });

  it("collapses surplus empty streams in the root workspace", () => {
    let state: State = {
      workspace: {
        meta: { key: 0, collapsed: false },
        type: "workspace",
        zoom: true,
        streams: [
          {
            key: 1,
            type: "stream",
            cards: [],
          },
          {
            key: 2,
            type: "stream",
            cards: [],
          },
        ],
      },
    };

    State.normalize(state);

    expect(state.workspace.streams.length).toEqual(1);
  });

  it("collapses empty streams in the root workspace", () => {
    let state: State = {
      workspace: {
        meta: { key: 0, collapsed: false },
        type: "workspace",
        zoom: true,
        streams: [
          {
            key: 1,
            type: "stream",
            cards: [cardA()],
          },
          {
            key: 2,
            type: "stream",
            cards: [],
          },
        ],
      },
    };

    State.normalize(state);

    expect(state.workspace.streams.length).toEqual(1);
  });

  it("does not collapse the last stream in nested workspaces", () => {
    let state: State = {
      workspace: {
        meta: { key: 0, collapsed: false },
        type: "workspace",
        zoom: true,
        streams: [
          {
            key: 1,
            type: "stream",
            cards: [
              {
                meta: { key: 2, collapsed: false },
                type: "workspace",
                zoom: true,
                streams: [{ key: 2, type: "stream", cards: [] }],
              },
            ],
          },
        ],
      },
    };

    State.normalize(state);

    expect((State.at(state, [0, 0]) as WorkspaceCard).streams.length).toEqual(
      1
    );
  });

  it("collapses empty streams in nested workspaces", () => {
    let state: State = {
      workspace: {
        meta: { key: 0, collapsed: false },
        type: "workspace",
        zoom: true,
        streams: [
          {
            key: 1,
            type: "stream",
            cards: [
              {
                meta: { key: 2, collapsed: false },
                type: "workspace",
                zoom: true,
                streams: [
                  { key: 2, type: "stream", cards: [cardA()] },
                  { key: 3, type: "stream", cards: [] },
                ],
              },
            ],
          },
        ],
      },
    };

    State.normalize(state);

    expect((State.at(state, [0, 0]) as WorkspaceCard).streams.length).toEqual(
      1
    );
  });
});
