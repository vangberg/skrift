import { createHyperscript } from "slate-hyperscript";
import { Editor } from "slate";
import assert from "assert";

export const jsx = createHyperscript({
  elements: {
    paragraph: { type: "paragraph" },
    heading: { type: "heading" },
    "bulleted-list": { type: "bulleted-list" },
    "list-item": { type: "list-item" }
  }
});

export const assertEqual = (actual: Editor, expected: Editor) => {
  try {
    assert.deepEqual(actual.children, expected.children);
  } catch (e) {
    console.log("Expected:");
    console.log(JSON.stringify(expected.children, null, 2));
    console.log("Actual:");
    console.log(JSON.stringify(actual.children, null, 2));

    throw e;
  }
  assert.deepEqual(actual.selection, expected.selection);
};
