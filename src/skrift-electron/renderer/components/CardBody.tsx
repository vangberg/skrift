import clsx from "clsx";
import React, { PropsWithChildren } from "react";

interface Props {
  visible: boolean;
}

export const CardBody: React.FC<PropsWithChildren<Props>> = ({ visible, children }) => {
  return (
    <div
      className={clsx(
        "bg-white flex-1 flex flex-col relative h-full p-2",
        { hidden: !visible }
      )}
    >
      {children}
    </div>
  );
};
