import React from "react";
import { RenderElementProps } from "slate-react";

export const NoteLink: React.FC<RenderElementProps> = props => {
  const className = "border-b-4 border-orange-400";

  return (
    <span {...props.attributes} className={className}>
      <a href="http://google.com">{props.element.id}</a>
      {props.children}
    </span>
  );
};
