/** @jsx jsx */
import { jsx, assertEqual } from "../../testSupport";
import { withList } from "./withList";

describe("withList", () => {
  describe("<enter> with empty list item", () => {
    it("exits the list", () => {
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
