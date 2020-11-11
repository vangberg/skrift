import React from "react";
import { WorkspaceContainer } from "./containers/WorkspaceContainer";

export const App: React.FC = () => {
  return (
    <div className="flex flex-1">
      <WorkspaceContainer />
    </div>
  );
};
