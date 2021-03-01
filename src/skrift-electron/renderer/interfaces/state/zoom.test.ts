import { State, Card, Stream, WorkspaceCard, NoteCard } from ".";
import { cardA, cardB, cardC, cardD, getState } from "./fixture";

describe("State.zoom", () => {
  let a: NoteCard, b: NoteCard, c: NoteCard, d: NoteCard, state: State;

  beforeEach(() => {
    a = cardA();
    a.meta.selected = true;

    b = cardB();
    b.meta.selected = true;

    c = cardC();
    c.meta.selected = true;

    d = cardD();

    state = {
      workspace: {
        meta: { key: 0, selected: false },
        type: "workspace",
        zoom: true,
        streams: [
          {
            // [0]
            key: 1,
            type: "stream",
            cards: [
              a, // [0, 0]
              b, // [0, 1]
            ],
          },
          {
            // [1]
            key: 2,
            type: "stream",
            cards: [
              c, // [1, 0]
              d, // [1, 1]
            ],
          },
        ],
      },
    };

    State.zoom(state, []);
  });

  it("replaces cards in first stream with workspace", () => {
    expect(state.workspace.streams[0].cards.length).toEqual(1);

    const workspace = State.at(state, [0, 0]) as WorkspaceCard;

    expect(workspace.type).toEqual("workspace");
    expect(workspace.streams.length).toEqual(2);
    expect(workspace.streams[0].cards).toEqual([a, b]);
    expect(workspace.streams[1].cards).toEqual([c]);
  });

  it("removes selected card from second stream", () => {
    expect(state.workspace.streams[1].cards).toEqual([d]);
  });
});
