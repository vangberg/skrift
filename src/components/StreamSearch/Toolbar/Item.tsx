import React from "react";

type Props = {
  onClick?: () => void;
};

export const Item: React.FC<Props> = ({ onClick, children, ...props }) => {
  return (
    <div
      className="ml-2 cursor-pointer select-none"
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};
