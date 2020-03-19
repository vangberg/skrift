import { createEditor as slateCreateEditor, Editor } from "slate";
import { withReact } from "slate-react";
import { withHistory } from "slate-history";

import { withNoteLink } from "./withNoteLink";
import { withHeading } from "./withHeading";
import { withShortcuts } from "./withShortcuts";
import { withMarkdown } from "./withMarkdown";

const PLUGINS = [
  withNoteLink,
  withHeading,
  withShortcuts,
  withMarkdown,
  withHistory
];

type Plugin = (editor: Editor) => Editor;

const withPlugins = (editor: Editor, plugins: Plugin[]) => {
  return plugins
    .reverse()
    .reduce((currentEditor, plugin) => plugin(currentEditor), editor);
};

export const createEditor = () =>
  withReact(withPlugins(slateCreateEditor(), PLUGINS));
