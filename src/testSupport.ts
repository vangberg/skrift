import { createHyperscript } from "slate-hyperscript";

export const jsx = createHyperscript({
  elements: {
    paragraph: { type: "paragraph" },
    heading: { type: "heading" }
  }
});
