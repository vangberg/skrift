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
nodes.math_inline = (state, node) => {
  state.write('$');
  state.renderInline(node);
  state.write('$');
};
nodes.math_display = (state, node) => {
  state.write('$$\n');
  state.renderInline(node);
  state.write('\n$$');
};
const marks = defaultMarkdownSerializer.marks;

export const markdownSerializer = new MarkdownSerializer(nodes, marks);
