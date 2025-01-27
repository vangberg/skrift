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
        "relative max-w-[32rem] flex-1 flex flex-col min-h-0 group my-2"
      )}
    >
      {children}
    </div>
  );
};
