import { Schema } from "prosemirror-model";
import {
  ellipsis,
  emDash,
  inputRules,
  textblockTypeInputRule,
  wrappingInputRule,
} from "prosemirror-inputrules";

export const buildInputRules = <S extends Schema>(schema: S) => {
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

  return inputRules({
    rules: [ellipsis, emDash, blockquote, orderedList, bulletList, heading],
  });
};
