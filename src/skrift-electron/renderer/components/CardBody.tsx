import React from "react";

export const CardBody: React.FC = ({ children }) => {
  return (
    <div className="rounded-b bg-white p-2 flex flex-col overflow-hidden">
      {children}
    </div>
  );
};
