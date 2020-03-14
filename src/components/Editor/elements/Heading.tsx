import React from "react";
import { RenderElementProps } from "slate-react";

const headerClasses = (level: number) => {
  switch (level) {
    case 1:
      return "text-xl font-bold";
    case 2:
      return "text-lg font-bold";
  }

  return "font-bold";
};
export const Heading: React.FC<RenderElementProps> = props => {
  return (
    <h1 className={headerClasses(props.element.level)} {...props.attributes}>
      {props.children}
    </h1>
  );
};

export default { Heading };
