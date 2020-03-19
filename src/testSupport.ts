import { createHyperscript } from "slate-hyperscript";

export const s = createHyperscript({
  elements: {
    paragraph: { type: "paragraph" },
    heading: { type: "heading" }
  }
});
