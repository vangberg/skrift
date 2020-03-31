import React from "react";
import { RenderElementProps } from "slate-react";
import cx from "classnames";

const headerClasses = (level: number) => {
  switch (level) {
    case 1:
      return "text-xl font-semibold";
    case 2:
      return "text-lg font-semibold";
  }

  return "font-semibold";
};
export const Heading: React.FC<RenderElementProps> = ({
  element,
  attributes,
  children
}) => {
  const classes = cx(headerClasses(element.level), "pt-2 first:pt-0");

  return (
    <h1 className={classes} {...attributes}>
      {children}
    </h1>
  );
};

export default { Heading };
