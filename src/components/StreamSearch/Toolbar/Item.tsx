import React from "react";

type Props = {
  onClick?: () => void;
};

export const Item: React.FC<Props> = ({ onClick, children, ...props }) => {
  return (
    <div
      className="p-1 text-gray-500 hover:bg-gray-200 rounded cursor-pointer select-none"
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};
