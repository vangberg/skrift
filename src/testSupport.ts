import { createHyperscript } from "slate-hyperscript";
import { Editor } from "slate";
import assert from "assert";

export const jsx = createHyperscript({
  elements: {
    paragraph: { type: "paragraph" },
    heading: { type: "heading" }
  }
});

export const assertEqual = (actual: Editor, expected: Editor) => {
  assert.deepEqual(actual.children, expected.children);
  assert.deepEqual(actual.selection, expected.selection);
};
