/** @jsx jsx */
import { jsx, assertEqual } from "../../testSupport";
import { withShortcuts } from "./withShortcuts";

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

    assertEqual(editor.children, output.children);
    assertEqual(editor.selection, output.selection);
  });

  it("inserts bulleted list", () => {
    // prettier-ignore
    const input = (
      <editor>
        <paragraph>
          *<cursor />
        </paragraph>
      </editor>
    );

    const editor = withShortcuts(input);
    editor.insertText(" ");

    // prettier-ignore
    const output = (
      <editor>
        <bulleted-list>
          <list-item><cursor /></list-item>
        </bulleted-list>
      </editor>
    );

    assertEqual(editor, output);
  });
});
