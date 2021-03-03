import clsx from "clsx";
import React from "react";

interface Props {
  title: string;
  enabled?: boolean;
  onClick: (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void;
}

export const Button: React.FC<Props> = ({ title, enabled, onClick }) => {
  enabled = enabled !== false;

  return (
    <span
      onClick={onClick}
      className={clsx(
        " select-none  rounded-full py-1 px-2",
        enabled
          ? "cursor-pointer ring-2 ring-blue-300 hover:bg-blue-300"
          : " text-gray-300"
      )}
    >
      {title}
    </span>
  );
};
