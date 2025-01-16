import { Command } from "prosemirror-state";
import {
  chainCommands,
  createParagraphNear,
  deleteSelection,
  joinBackward,
  liftEmptyBlock,
  newlineInCode,
  selectNodeBackward,
  selectParentNode,
  splitBlock
} from "prosemirror-commands";
import { redo, undo } from "prosemirror-history";
import { NodeType, Schema } from "prosemirror-model";
import {
  liftListItem,
  sinkListItem,
  splitListItem,
} from "prosemirror-schema-list";

export function buildKeymap<S extends Schema>(schema: S) {
  const keys: { [key: string]: Command } = {};
  let type;

  const enter: Command[] = [];

  keys["Escape"] = selectParentNode;

  keys["Enter"] = chainCommands(
    ...enter,
    splitListItem(schema.nodes.list_item),
    newlineInCode,
    createParagraphNear,
    liftEmptyBlock,
    splitBlock
  );

  keys["Backspace"] = chainCommands(
    deleteSelection,
    joinBackward,
    selectNodeBackward
  );

  keys["Mod-z"] = undo;
  keys["Mod-y"] = redo;

  if ((type = schema.nodes.list_item)) {
    keys["Mod-]"] = sinkListItem(type);
    keys["Mod-["] = liftListItem(type);
  }

  return keys;
}
