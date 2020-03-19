/** @jsx jsx */
import { jsx } from "../../testSupport";
import { withShortcuts } from "./withShortcuts";
import { Transforms } from "slate";
import assert from "assert";

describe("withShortcuts", () => {
  it("inserts header 1", () => {
    // prettier-ignore
    const input = (
      <editor>
        <paragraph>Line 1</paragraph>
        <paragraph>
          #<cursor />Line 2
        </paragraph>
        <paragraph>Line 3</paragraph>
      </editor>
    );

    const editor = withShortcuts(input);
    editor.insertText(" ");

    // prettier-ignore
    const output = (
      <editor>
        <paragraph>Line 1</paragraph>
        <heading level={1}>
          <cursor />Line 2
        </heading>
        <paragraph>Line 3</paragraph>
      </editor>
    );

    assert.deepEqual(editor.children, output.children);
    assert.deepEqual(editor.selection, output.selection);
  });
});
