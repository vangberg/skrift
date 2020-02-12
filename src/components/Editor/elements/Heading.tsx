import React from "react";
import { RenderElementProps } from "slate-react";

export const Heading: React.FC<RenderElementProps> = props => {
  const className = "text-xl font-bold";

  return (
    <h1 className={className} {...props.attributes}>
      {props.children}
    </h1>
  );
};

export default { Heading };
