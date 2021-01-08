import { State, Card, Stream, WorkspaceCard } from ".";
import { cardA, cardB, cardC, cardD, getState } from "./fixture";

describe("State.collapse", () => {
  it("does not collapse the last stream in the root workspace", () => {
    let state: State = {
      workspace: {
        key: 0,
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

    State.collapse(state);

    expect(state.workspace.streams.length).toEqual(1);
  });

  it("collapses surplus empty streams in the root workspace", () => {
    let state: State = {
      workspace: {
        key: 0,
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

    State.collapse(state);

    expect(state.workspace.streams.length).toEqual(1);
  });

  it("collapses empty streams in the root workspace", () => {
    let state: State = {
      workspace: {
        key: 0,
        type: "workspace",
        zoom: true,
        streams: [
          {
            key: 1,
            type: "stream",
            cards: [cardA],
          },
          {
            key: 2,
            type: "stream",
            cards: [],
          },
        ],
      },
    };

    State.collapse(state);

    expect(state.workspace.streams.length).toEqual(1);
  });

  it("does not collapse the last stream in nested workspaces", () => {
    let state: State = {
      workspace: {
        key: 0,
        type: "workspace",
        zoom: true,
        streams: [
          {
            key: 1,
            type: "stream",
            cards: [
              {
                key: 2,
                type: "workspace",
                zoom: true,
                streams: [{ key: 2, type: "stream", cards: [] }],
              },
            ],
          },
        ],
      },
    };

    State.collapse(state);

    expect((State.at(state, [0, 0]) as WorkspaceCard).streams.length).toEqual(
      1
    );
  });

  it("collapses empty streams in nested workspaces", () => {
    let state: State = {
      workspace: {
        key: 0,
        type: "workspace",
        zoom: true,
        streams: [
          {
            key: 1,
            type: "stream",
            cards: [
              {
                key: 2,
                type: "workspace",
                zoom: true,
                streams: [
                  { key: 2, type: "stream", cards: [cardA] },
                  { key: 3, type: "stream", cards: [] },
                ],
              },
            ],
          },
        ],
      },
    };

    State.collapse(state);

    expect((State.at(state, [0, 0]) as WorkspaceCard).streams.length).toEqual(
      1
    );
  });
});
