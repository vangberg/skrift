import React, { useReducer } from "react";
import { Router, RouteComponentProps } from "@reach/router";
import { WorkspaceContainer } from "./containers/WorkspaceContainer";

const route = (Component: React.FC): React.FC<RouteComponentProps> => {
  return (props: RouteComponentProps) => <Component />;
};

const Workspace = route(WorkspaceContainer);

export const App: React.FC = () => {
  return (
    <Router className="flex flex-1">
      <Workspace path="/" />
    </Router>
  );
};
