import clsx from "clsx";
import React from "react";

interface Props {
  visible: boolean;
}

export const CardBody: React.FC<Props> = ({ visible, children }) => {
  return (
    <div
      className={clsx(
        "skrift-card-body bg-white flex-1 flex flex-col overflow-y-auto relative",
        { hidden: !visible }
      )}
    >
      {children}
    </div>
  );
};
