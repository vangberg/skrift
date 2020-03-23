import React from "react";
import { RenderElementProps } from "slate-react";

export const NumberList: React.FC<RenderElementProps> = props => {
  return (
    <ul className="list-decimal list-outside ml-5" {...props.attributes}>
      {props.children}
    </ul>
  );
};
