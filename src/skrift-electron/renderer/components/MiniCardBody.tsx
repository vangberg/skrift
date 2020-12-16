import React from "react";

export const MiniCardBody: React.FC = ({ children }) => {
  return <div className="p-2 flex flex-col overflow-hidden">{children}</div>;
};
