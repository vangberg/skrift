/** @jsx jsx */
import { jsx, assertEqual } from "../../testSupport";
import { withShortcuts } from "./withShortcuts";

describe("withShortcuts", () => {
  describe("# followed by <space>", () => {
    describe("in paragraph", () => {
      it("replaces paragraph with header 1", () => {
        // prettier-ignore
        const input = (
        <editor>
          <paragraph>
            #<cursor />Line
          </paragraph>
        </editor>
      );

        const editor = withShortcuts(input);
        editor.insertText(" ");

        // prettier-ignore
        const output = (
        <editor>
          <heading level={1}>
            <cursor />Line
          </heading>
        </editor>
      );

        assertEqual(editor, output);
      });
    });

    describe("in list item", () => {
      it("does nothing", () => {
        // prettier-ignore
        const input = (
          <editor>
            <bulleted-list>
              <list-item>#<cursor />Item 1</list-item>
            </bulleted-list>
          </editor>
        );

        const editor = withShortcuts(input);
        editor.insertText(" ");

        // prettier-ignore
        const output = (
          <editor>
            <bulleted-list>
              <list-item># <cursor />Item 1</list-item>
            </bulleted-list>
          </editor>
        );

        assertEqual(editor, output);
      });
    });
  });

  describe("<delete> at start of header", () => {
    it("replaces header with paragraph", () => {
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
  });

  describe("* followed by <space>", () => {
    describe("in paragraph", () => {
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
  });

  describe("<delete> at beginning of empty list item", () => {
    describe("with no following list items", () => {
      it("exits list", () => {
        // prettier-ignore
        const input = (
          <editor>
            <bulleted-list>
              <list-item>Item 1</list-item>
              <list-item><cursor /></list-item>
            </bulleted-list>
          </editor>
        );

        const editor = withShortcuts(input);
        editor.deleteBackward();

        // prettier-ignore
        const output = (
          <editor>
            <bulleted-list>
              <list-item>Item 1</list-item>
            </bulleted-list>
            <paragraph><cursor /></paragraph>
          </editor>
        );

        assertEqual(editor, output);
      });
    });

    describe("with following list items", () => {
      it("splits list", () => {
        // prettier-ignore
        const input = (
          <editor>
            <bulleted-list>
              <list-item>Item 1</list-item>
              <list-item><cursor />Item 2</list-item>
              <list-item>Item 3</list-item>
            </bulleted-list>
          </editor>
        );

        const editor = withShortcuts(input);
        editor.deleteBackward();

        // prettier-ignore
        const output = (
          <editor>
            <bulleted-list>
              <list-item>Item 1</list-item>
            </bulleted-list>
            <paragraph><cursor />Item 2</paragraph>
            <bulleted-list>
              <list-item>Item 3</list-item>
            </bulleted-list>
          </editor>
        );

        assertEqual(editor, output);
      });
    });
  });
});
