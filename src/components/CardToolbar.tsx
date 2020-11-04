import React from "react";

export const CardToolbar: React.FC = ({ children }) => {
  return (
    <div className="flex px-2 py-1 justify-end bg-orange-300 rounded-t">
      {children}
    </div>
  );
};
