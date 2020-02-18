import React, { useMemo } from "react";
import { Editable, RenderLeafProps, useEditor } from "slate-react";

import { renderElement } from "./renderElement";
import { isHotkey } from "is-hotkey";
import { SkriftTransforms } from "./transforms";
import { Note } from "../../interfaces/note";

const renderLeaf = ({ attributes, children }: RenderLeafProps) => {
  const className = window.skriftDebug ? "border border-green-200" : "";

  return (
    <span {...attributes} className={className}>
      {children}
    </span>
  );
};

type Props = {
  onOpen: (id: string) => void;
  getNote: (id: string) => Note;
};

export const SkriftEditable: React.FC<Props> = ({ onOpen, getNote }) => {
  const editor = useEditor();

  const handleRenderElement = useMemo(
    () => renderElement({ getNote, onOpen }),
    [getNote, onOpen]
  );

  return (
    <Editable
      autoFocus={true}
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
  );
};
