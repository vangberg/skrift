import React from "react";

export const CardBody: React.FC = ({ children }) => {
  return (
    <div className="rounded-b bg-white flex flex-col overflow-hidden">
      {children}
    </div>
  );
};
