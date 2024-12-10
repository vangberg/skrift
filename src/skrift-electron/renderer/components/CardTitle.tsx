import clsx from "clsx";
import React, { PropsWithChildren } from "react";

interface Props {
  visible: boolean;
}

export const CardTitle: React.FC<PropsWithChildren<Props>> = ({ visible, children }) => {
  return (
    <div className={clsx("bg-white", { hidden: !visible })}>{children}</div>
  );
};
