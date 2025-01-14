import { Schema } from "prosemirror-model";

import {
  ellipsis,
  InputRule,
  inputRules,
  textblockTypeInputRule,
  wrappingInputRule,
} from "prosemirror-inputrules";

import {
  makeInlineMathInputRule,
  REGEX_INLINE_MATH_DOLLARS, REGEX_BLOCK_MATH_DOLLARS
} from "@benrbray/prosemirror-math";
import { NodeSelection } from "prosemirror-state";

export const buildInputRules = <S extends Schema>(schema: S) => {
  const hr = new InputRule(/^(---)$/, (state, match, start, end) => {
    const { tr } = state;

    if (match[0]) {
      tr.replaceWith(start - 1, end, schema.nodes.horizontal_rule.create({}));
    }

    return tr;
  });

  const blockquote = wrappingInputRule(/^\s*>\s$/, schema.nodes.blockquote);

  const orderedList = wrappingInputRule(
    /^(\d+)\.\s$/,
    schema.nodes.ordered_list,
    (match) => ({ order: +match[1] }),
    (match, node) => node.childCount + node.attrs.order == +match[1]
  );

  const bulletList = wrappingInputRule(
    /^\s*([-+*])\s$/,
    schema.nodes.bullet_list
  );

  const heading = textblockTypeInputRule(
    new RegExp("^(#{1,6})\\s$"),
    schema.nodes.heading,
    (match) => ({ level: match[1].length })
  );

  let inlineMathInputRule = makeInlineMathInputRule(REGEX_INLINE_MATH_DOLLARS, schema.nodes.math_inline);

  // For some reason, this code works, but using makeBlockMathInputRule doesn't.
  let blockMathInputRule = new InputRule(REGEX_BLOCK_MATH_DOLLARS, (state, match, start, end) => {
    let $start = state.doc.resolve(start);
    if (!$start.node(-1).canReplaceWith($start.index(-1), $start.indexAfter(-1), schema.nodes.math_display)) {
      return null;
    }

    let tr = state.tr
      .delete(start, end)
      .setBlockType(start, start, schema.nodes.math_display);

    return tr.setSelection(NodeSelection.create(
      tr.doc,
      tr.mapping.map($start.pos - 1)
    ));
  });


  return inputRules({
    rules: [ellipsis, hr, blockquote, orderedList, bulletList, heading, inlineMathInputRule, blockMathInputRule],
  });
};
