import {
  chainCommands,
  Command,
  createParagraphNear,
  deleteSelection,
  joinBackward,
  Keymap,
  liftEmptyBlock,
  newlineInCode,
  selectNodeBackward,
  splitBlock,
} from "prosemirror-commands";
import { redo, undo } from "prosemirror-history";
import { NodeType, Schema } from "prosemirror-model";
import {
  liftListItem,
  sinkListItem,
  splitListItem,
} from "prosemirror-schema-list";

export function buildKeymap<S extends Schema>(schema: S) {
  let keys: Keymap<S> = {};
  let type;

  let enter: Command[] = [];

  enter.push(splitListItem(schema.nodes.list_item));

  keys["Enter"] = chainCommands(
    ...enter,
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

  if ((type = schema.nodes.list_item as NodeType<S>)) {
    keys["Mod-]"] = sinkListItem(type);
    keys["Mod-["] = liftListItem(type);
  }

  return keys;
}
