import React, { useCallback } from "react";

type Props = {
  onClick?: () => void;
};

export const Close: React.FC<Props> = ({ onClick }) => {
  const classNames = [
    "w-6 h-6 flex items-center justify-center rounded-full",
    "border border-gray-500 text-gray-500",
    "hover:bg-gray-500 hover:text-white",
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
