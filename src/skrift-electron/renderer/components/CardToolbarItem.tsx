import clsx from "clsx";
import React, { PropsWithChildren, useCallback } from "react";

type Props = {
  onClick?: () => void;
  className?: string;
};

export const CardToolbarItem = React.forwardRef<HTMLDivElement, PropsWithChildren<Props>>(({
  onClick,
  className,
  children,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
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
});
