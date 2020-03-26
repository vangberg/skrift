import React from "react";
import { RenderElementProps } from "slate-react";

export const ListItem: React.FC<RenderElementProps> = props => {
  return <li {...props.attributes}>{props.children}</li>;
};
