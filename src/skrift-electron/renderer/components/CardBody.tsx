import React from "react";

export const CardBody: React.FC = ({ children }) => {
  return (
    <div className=" bg-white flex flex-col overflow-hidden">{children}</div>
  );
};
