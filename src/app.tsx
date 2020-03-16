import React from "react";
import { WorkspaceContainer } from "./containers/WorkspaceContainer";
import { DevInfo } from "./components/DevInfo";

export const App: React.FC = () => {
  return (
    <div className="flex flex-1">
      <DevInfo />
      <WorkspaceContainer />
    </div>
  );
};
