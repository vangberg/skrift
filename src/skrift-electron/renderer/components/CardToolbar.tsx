import React from "react";

interface Props {}

export const CardToolbar: React.FC<Props> = ({ children }) => {
  return (
    <div className="flex flex-wrap justify-end px-2 py-1 bg-gray-100 rounded-t-md">
      {children}
    </div>
  );
};
