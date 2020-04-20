import React from "react";

type Props = {
  onClick: () => void;
};

export const Item: React.FC<Props> = ({ onClick, children }) => {
  return (
    <div
      className="p-1 text-gray-500 hover:bg-gray-200 rounded cursor-pointer select-none"
      onClick={onClick}
    >
      {children}
    </div>
  );
};
