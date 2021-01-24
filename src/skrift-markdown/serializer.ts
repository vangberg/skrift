import {
  defaultMarkdownSerializer,
  MarkdownSerializer,
} from "prosemirror-markdown";

const nodes = defaultMarkdownSerializer.nodes;
nodes.link = (state, node) => {
  state.write(`[`);
  state.renderInline(node);
  state.write(`](${node.attrs.href})`);
};
const marks = defaultMarkdownSerializer.marks;

export const markdownSerializer = new MarkdownSerializer(nodes, marks);
