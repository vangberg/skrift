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
        "skrift-card mx-2 my-2 relative flex flex-1 flex-col group"
      )}
    >
      <div className="relative flex-auto flex flex-col ">
        {children}
      </div>
    </div>
  );
};
