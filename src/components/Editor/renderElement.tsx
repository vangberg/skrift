import React from "react";
import { RenderElementProps } from "slate-react";

import { NoteLink } from "./elements/NoteLink";
import { Heading } from "./elements/Heading";
import { Paragraph } from "./elements/Paragraph";
import { Note } from "../../interfaces/note";

const DefaultElement: React.FC<RenderElementProps> = ({
  attributes,
  children
}) => {
  const className = window.skriftDebug ? "border border-blue-200" : "";
  return (
    <p {...attributes} className={className}>
      {children}
    </p>
  );
};

export function renderElement(options: { getNote: (id: string) => Note }) {
  const { getNote } = options;

  return function(props: RenderElementProps) {
    switch (props.element.type) {
      case "heading":
        return <Heading {...props} />;
      case "note-link":
        return <NoteLink getNote={getNote} {...props} />;
      case "paragraph":
        return <Paragraph {...props} />;
      default:
        return <DefaultElement {...props} />;
    }
  };
}
