import React from "react";

interface Props {
  backgroundColor: string;
}
export const CardToolbar: React.FC<Props> = ({ backgroundColor, children }) => {
  return (
    <div className="skrift-card-toolbar absolute top-0 right-0 p-2 flex flex-wrap opacity-0 transition group-hover:opacity-100">
      {children}
    </div>
  );
};
