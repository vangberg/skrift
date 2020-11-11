import React from "react";
import { RenderElementProps } from "slate-react";

export const ListItem: React.FC<RenderElementProps> = props => {
  return (
    <li className="skrift-list-item" {...props.attributes}>
      {props.children}
    </li>
  );
};
