/** @jsx jsx */
import { Editor, Transforms } from "slate";
import { jsx, assertEqual } from "../../testSupport";
import { withList } from "./withList";

describe("withList", () => {
  describe("<enter> with empty list item", () => {
    describe("in top-level list", () => {
      it("splits the list and turns item into a paragraph", () => {
        // prettier-ignore
        const input = (
          <editor>
            <bulleted-list>
              <list-item>Item 1</list-item>
              <list-item><cursor /></list-item>
              <list-item>Item 3</list-item>
            </bulleted-list>
          </editor>
        );

        const editor = withList(input);
        editor.insertBreak();

        // prettier-ignore
        const output = (
          <editor>
            <bulleted-list>
              <list-item>Item 1</list-item>
            </bulleted-list>
            <paragraph><cursor /></paragraph>
            <bulleted-list>
              <list-item>Item 3</list-item>
            </bulleted-list>
          </editor>
        );

        assertEqual(editor, output);
      });
    });
  });

  describe("normalization", () => {
    describe("two adjacent lists of same type", () => {
      it("merges them", () => {
        // prettier-ignore
        const input = (
          <editor>
            <bulleted-list>
              <list-item>Item 1</list-item>
            </bulleted-list>
            <bulleted-list>
              <list-item>Item 2</list-item>
            </bulleted-list>
          </editor>
        );

        const editor = withList(input);
        Editor.normalize(editor, { force: true });

        // prettier-ignore
        const output = (
          <editor>
            <bulleted-list>
              <list-item>Item 1</list-item>
              <list-item>Item 2</list-item>
            </bulleted-list>
          </editor>
        );

        assertEqual(editor, output);
      });
    });

    describe("removing a paragraph, causing two lists to become adjacent", () => {
      it("merges them", () => {
        // prettier-ignore
        const input = (
          <editor>
            <bulleted-list>
              <list-item>Item 1</list-item>
            </bulleted-list>
            <paragraph>Paragraph</paragraph>
            <bulleted-list>
              <list-item>Item 2</list-item>
            </bulleted-list>
          </editor>
        );

        const editor = withList(input);
        Transforms.removeNodes(editor, { at: [1] });

        // prettier-ignore
        const output = (
          <editor>
            <bulleted-list>
              <list-item>Item 1</list-item>
              <list-item>Item 2</list-item>
            </bulleted-list>
          </editor>
        );

        assertEqual(editor, output);
      });
    });
  });
});
