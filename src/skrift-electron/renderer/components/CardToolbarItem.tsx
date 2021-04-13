import clsx from "clsx";
import React, { useCallback } from "react";

type Props = {
  onClick?: () => void;
  className?: string;
};

export const CardToolbarItem: React.FC<Props> = ({
  onClick,
  className,
  children,
  ...props
}) => {
  const handleClick = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      onClick?.();
    },
    [onClick]
  );

  return (
    <div
      className={clsx(
        "ml-2 mb-2 px-2 py-1 select-none rounded-full shadow bg-gray-100 cursor-pointer",
        className
      )}
      onClick={handleClick}
      tabIndex={0}
      {...props}
    >
      {children}
    </div>
  );
};
