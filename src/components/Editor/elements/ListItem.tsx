import React from "react";
import { RenderElementProps } from "slate-react";

export const ListItem: React.FC<RenderElementProps> = props => {
  return (
    <li className="border border-red-500" {...props.attributes}>
      {props.children}
    </li>
  );
};
