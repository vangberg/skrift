import React from "react";

export const CardBody: React.FC = ({ children }) => {
  return (
    <div className="skrift-card-body bg-white flex-1 flex flex-col overflow-y-auto relative">
      {children}
    </div>
  );
};
