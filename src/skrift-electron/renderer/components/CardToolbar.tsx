import React from "react";

interface Props {
  backgroundColor: string;
}
export const CardToolbar: React.FC<Props> = ({ backgroundColor, children }) => {
  return (
    <div className={`flex px-2 py-1 justify-end ${backgroundColor}`}>
      {children}
    </div>
  );
};
