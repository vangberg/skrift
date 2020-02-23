import React from "react";
import { Router } from "@reach/router";
import { WorkspaceContainer } from "./containers/WorkspaceContainer";

export const App: React.FC = () => {
  return (
    <Router className="flex flex-1">
      <WorkspaceContainer path="/" />
    </Router>
  );
};
