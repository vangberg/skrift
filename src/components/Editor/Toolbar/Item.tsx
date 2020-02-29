import React from "react";

type Props = {
  onClick: () => void;
};

export const Item: React.FC<Props> = ({ onClick, children }) => {
  return (
    <div
      className="ml-1 text-gray-500 hover:text-gray-600 text-sm cursor-pointer"
      onClick={onClick}
    >
      [{children}]
    </div>
  );
};
