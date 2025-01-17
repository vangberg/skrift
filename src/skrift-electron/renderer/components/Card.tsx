import clsx from "clsx";
import React from "react";

interface Props {
  className?: string;
  children: React.ReactNode;
}

export const Card: React.FC<Props> = ({ className, children }) => {
  return (
    <div
      className={clsx(
        className,
        "relative flex flex-1 flex-col group mx-2"
      )}
    >
      {children}
    </div>
  );
};
