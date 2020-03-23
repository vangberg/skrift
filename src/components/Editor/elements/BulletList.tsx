import React from "react";
import { RenderElementProps } from "slate-react";

export const BulletList: React.FC<RenderElementProps> = props => {
  return (
    <ul className="list-disc list-outside ml-5" {...props.attributes}>
      {props.children}
    </ul>
  );
};
