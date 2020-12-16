import React from "react";

export const MiniCard: React.FC = ({ children }) => {
  return (
    <div className="bg-white rounded-b shadow-md mx-2 mb-2">{children}</div>
  );
};
