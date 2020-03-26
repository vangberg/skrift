/** @jsx jsx */
import { jsx, assertEqual, hyperprint } from "../../testSupport";
import { SkriftTransforms } from "./transforms";
import { withList } from "./withList";

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
      it("nests list item under first list item", () => {
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

  describe("unindentListItem", () => {
    describe("top-level list", () => {
      describe("first item", () => {
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
          SkriftTransforms.unindentListItem(editor);

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
    });

    describe("nested list", () => {
      describe("only item", () => {
        it("moves item to parent list and removes nested list", () => {
          // prettier-ignore
          const input = (
            <editor>
              <bulleted-list>
                <list-item>Top 1</list-item>
                <list-item>
                  <paragraph>Top 2</paragraph>
                  <bulleted-list>
                    <list-item><cursor />Nested 1</list-item>
                  </bulleted-list>
                </list-item>
              </bulleted-list>
            </editor>
          );

          const editor = withList(input);
          SkriftTransforms.unindentListItem(editor);

          // prettier-ignore
          const output = (
            <editor>
              <bulleted-list>
                <list-item>Top 1</list-item>
                <list-item>Top 2</list-item>
                <list-item><cursor />Nested 1</list-item>
              </bulleted-list>
            </editor>
          );

          assertEqual(editor, output);
        });
      });

      describe("item", () => {
        it("moves item to parent list and captures siblings", () => {
          // prettier-ignore
          const input = (
            <editor>
              <bulleted-list>
                <list-item>
                  <paragraph>Top 1</paragraph>
                  <bulleted-list>
                    <list-item>Nested 1</list-item>
                    <list-item><cursor />Nested 2</list-item>
                    <list-item>Nested 3</list-item>
                  </bulleted-list>
                  <paragraph>Nested paragraph</paragraph>
                </list-item>
              </bulleted-list>
            </editor>
          );

          const editor = withList(input);
          SkriftTransforms.unindentListItem(editor);

          // prettier-ignore
          const output = (
            <editor>
              <bulleted-list>
                <list-item>
                  <paragraph>Top 1</paragraph>
                  <bulleted-list>
                    <list-item>Nested 1</list-item>
                  </bulleted-list>
                </list-item>
                <list-item>
                  <paragraph>
                    <cursor />Nested 2
                  </paragraph>
                  <bulleted-list>
                    <list-item>Nested 3</list-item>
                  </bulleted-list>
                  <paragraph>Nested paragraph</paragraph>
                </list-item>
              </bulleted-list>
            </editor>
          );

          assertEqual(editor, output);
        });
      });
    });
  });
});
