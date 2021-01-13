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
import { Schema } from "prosemirror-model";
import { splitListItem } from "prosemirror-schema-list";

export function buildKeymap<S extends Schema>(schema: S) {
  let keys: Keymap<S> = {};
  let type;

  let enter: Command[] = [];

  if ((type = schema.nodes.list_item)) {
    enter.push(splitListItem(type));
  }

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

  return keys;
}
