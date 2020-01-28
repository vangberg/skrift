import React, { useCallback } from "react";

type Props = {
  onClick?: () => void;
};

export const Close: React.FC<Props> = ({ onClick }) => {
  const classNames = [
    "w-5 h-5 flex items-center justify-center rounded-full",
    "border border-gray-500 text-gray-500",
    "hover:bg-gray-500 hover:text-white",
    "text-sm",
    "cursor-pointer"
  ].join(" ");

  const handleClick = useCallback(() => {
    if (onClick) {
      onClick();
    }
  }, [onClick]);

  return (
    <div className={classNames} onClick={handleClick}>
      X
    </div>
  );
};
