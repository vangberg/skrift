import clsx from "clsx";
import React from "react";

interface Props {
  visible: boolean;
}

export const CardTitle: React.FC<Props> = ({ visible, children }) => {
  return (
    <div className={clsx("bg-white", { hidden: !visible })}>{children}</div>
  );
};
