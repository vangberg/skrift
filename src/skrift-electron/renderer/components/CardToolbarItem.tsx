import clsx from "clsx";
import React, { PropsWithChildren, useCallback } from "react";

type Props = {
  onClick?: () => void;
  className?: string;
};

export const CardToolbarItem: React.FC<PropsWithChildren<Props>> = ({
  onClick,
  className,
  children,
  ...props
}) => {
  return (
    <div
      className={clsx(
        "ml-2 select-none cursor-pointer text-gray-600 hover:text-black",
        className
      )}
      onClick={onClick}
      tabIndex={0}
      {...props}
    >
      {children}
    </div>
  );
};
