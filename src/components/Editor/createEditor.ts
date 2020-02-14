import { createEditor as slateCreateEditor } from "slate";
import { withReact, ReactEditor } from "slate-react";

import { withNoteLink } from "./withNoteLink";
import { withHeading } from "./withHeading";
import { withShortcuts } from "./withShortcuts";
import { withMarkdown } from "./withMarkdown";

const PLUGINS = [withNoteLink, withHeading, withShortcuts, withMarkdown];

type Plugin = (editor: ReactEditor) => ReactEditor;

const withPlugins = (editor: ReactEditor, plugins: Plugin[]) => {
  return plugins
    .reverse()
    .reduce((currentEditor, plugin) => plugin(currentEditor), editor);
};

export const createEditor = () =>
  withPlugins(withReact(slateCreateEditor()), PLUGINS);
