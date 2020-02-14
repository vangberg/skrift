import React, { useMemo, useCallback, useState } from "react";
import { Editor, Node, createEditor } from "slate";
import {
  Slate,
  Editable,
  withReact,
  RenderLeafProps,
  ReactEditor
} from "slate-react";

import { withNoteLink } from "./withNoteLink";
import { renderElement } from "./renderElement";
import { Serializer } from "../../interfaces/serializer";
import { withHeading } from "./withHeading";
import { isHotkey } from "is-hotkey";
import { SkriftTransforms } from "./transforms";
import { withShortcuts } from "./withShortcuts";
import { withMarkdown } from "./withMarkdown";
import { Note } from "../../interfaces/note";

const deserialize = (markdown: string) => {
  const nodes = Serializer.deserialize(markdown);

  if (nodes.length > 0) {
    return nodes;
  }

  return [
    {
      type: "paragraph",
      children: [{ text: "" }]
    }
  ];
};

const renderLeaf = ({ attributes, children }: RenderLeafProps) => {
  const className = window.skriftDebug ? "border border-green-200" : "";

  return (
    <span {...attributes} className={className}>
      {children}
    </span>
  );
};

const PLUGINS = [withNoteLink, withHeading, withShortcuts, withMarkdown];

type Plugin = (editor: ReactEditor) => ReactEditor;

const withPlugins = (editor: ReactEditor, plugins: Plugin[]) => {
  return plugins
    .reverse()
    .reduce((currentEditor, plugin) => plugin(currentEditor), editor);
};

type Props = {
  markdown: string;
  onUpdate: (markdown: string) => void;
  onOpen: (id: string) => void;
  getNote: (id: string) => Note;
};

export const SkriftEditor: React.FC<Props> = ({
  markdown,
  onUpdate,
  onOpen,
  getNote
}) => {
  const editor = useMemo(
    () => withPlugins(withReact(createEditor()), PLUGINS),
    []
  );

  const [value, setValue] = useState(() => deserialize(markdown));

  const handleChange = useCallback(
    (value: Node[]) => {
      setValue(value);
      onUpdate(Serializer.serialize(value));
    },
    [onUpdate]
  );

  const handleRenderElement = useMemo(
    () => renderElement({ getNote, onOpen }),
    [getNote]
  );

  return (
    <Slate editor={editor} value={value} onChange={handleChange}>
      <Editable
        renderElement={handleRenderElement}
        renderLeaf={renderLeaf}
        onKeyDown={event => {
          const { nativeEvent } = event;
          if (isHotkey("shift+enter")(nativeEvent)) {
            event.preventDefault();
            SkriftTransforms.insertSoftBreak(editor);
          }
        }}
      />
      {window.skriftDebug && (
        <pre className="text-xs">{JSON.stringify(value, undefined, 2)}</pre>
      )}
    </Slate>
  );
};
