import React, { PropsWithChildren } from "react";

interface Props { }

export const CardToolbar: React.FC<PropsWithChildren<Props>> = ({ children }) => {
  return (
    <div className="flex flex-wrap justify-end px-2 py-1 bg-gray-100 rounded-t-md cursor-move">
      {children}
    </div>
  );
};
