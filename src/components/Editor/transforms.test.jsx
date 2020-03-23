/** @jsx jsx */
import { jsx, assertEqual } from "../../testSupport";
import { SkriftTransforms } from "./transforms";

describe("transforms", () => {
  describe("indentListItem", () => {
    describe("at first list item", () => {
      it("does nothing", () => {
        // prettier-ignore
        const input = (
          <editor>
            <bulleted-list>
              <list-item><cursor />Item 1</list-item>
            </bulleted-list>
          </editor>
        );

        const editor = input;
        SkriftTransforms.indentListItem(editor);

        // prettier-ignore
        const output = (
          <editor>
            <bulleted-list>
              <list-item><cursor />Item 1</list-item>
            </bulleted-list>
          </editor>
        );

        assertEqual(editor, output);
      });
    });

    describe("at second list item", () => {
      it.only("nests list item under first list item", () => {
        // prettier-ignore
        const input = (
          <editor>
            <bulleted-list>
              <list-item>Item 1</list-item>
              <list-item><cursor />Item 2</list-item>
            </bulleted-list>
          </editor>
        );

        const editor = input;
        SkriftTransforms.indentListItem(editor);

        // prettier-ignore
        const output = (
          <editor>
            <bulleted-list>
              <list-item>
                <paragraph>Item 1</paragraph>
                <bulleted-list>
                  <list-item><cursor />Item 2</list-item>
                </bulleted-list>
              </list-item>
            </bulleted-list>
          </editor>
        );

        assertEqual(editor, output);
      });
    });
  });
});
