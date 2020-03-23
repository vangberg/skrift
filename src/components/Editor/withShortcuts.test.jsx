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

    assertEqual(editor, output);
  });

  it("removes header 1", () => {
    // prettier-ignore
    const input = (
      <editor>
        <heading level={1}><cursor />Line 1</heading>
      </editor>
    );

    const editor = withShortcuts(input);
    editor.deleteBackward();

    // prettier-ignore
    const output = (
      <editor>
        <paragraph><cursor />Line 1</paragraph>
      </editor>
    );

    assertEqual(editor, output);
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
