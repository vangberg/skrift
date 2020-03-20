import React from "react";
import { RenderElementProps } from "slate-react";

import { NoteLink } from "./elements/NoteLink";
import { Heading } from "./elements/Heading";
import { Paragraph } from "./elements/Paragraph";
import { Note } from "../../interfaces/note";
import { BulletList } from "./elements/BulletList";
import { NumberList } from "./elements/NumberList";
import { ListItem } from "./elements/ListItem";

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

export function renderElement(options: {
  getNote: (id: string) => Note | undefined;
  onOpen: (id: string, push: boolean) => void;
}) {
  const { getNote, onOpen } = options;

  return function RenderElement(props: RenderElementProps) {
    switch (props.element.type) {
      case "heading":
        return <Heading {...props} />;
      case "note-link":
        return <NoteLink getNote={getNote} onOpen={onOpen} {...props} />;
      case "paragraph":
        return <Paragraph {...props} />;
      case "bulleted-list":
        return <BulletList {...props} />;
      case "numbered-list":
        return <NumberList {...props} />;
      case "list-item":
        return <ListItem {...props} />;
      default:
        return <DefaultElement {...props} />;
    }
  };
}
