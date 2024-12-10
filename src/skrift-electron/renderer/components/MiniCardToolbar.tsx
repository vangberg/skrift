import React, { PropsWithChildren } from "react";

interface Props {
  backgroundColor: string;
}
export const MiniCardToolbar: React.FC<PropsWithChildren<Props>> = ({
  backgroundColor,
  children,
}) => {
  return (
    <div className={`flex px-2 py-1 justify-end ${backgroundColor} rounded-t`}>
      {children}
    </div>
  );
};
