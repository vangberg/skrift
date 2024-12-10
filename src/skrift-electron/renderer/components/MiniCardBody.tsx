import React, { PropsWithChildren } from "react";

export const MiniCardBody: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  return <div className="p-2 flex flex-col overflow-hidden">{children}</div>;
};
