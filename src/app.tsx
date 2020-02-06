import React from 'react'
import { Router, RouteComponentProps } from '@reach/router'
import { WorkspaceContainer } from './containers/WorkspaceContainer'
import { SignupContainer } from './containers/SignupContainer'

const route = (Component: React.FC): React.FC<RouteComponentProps> => {
  return (props: RouteComponentProps) => <Component />
}

const Workspace = route(WorkspaceContainer)
const Signup = route(SignupContainer)

export const App: React.FC = () => {
  return <Router className="flex flex-1">
    <Workspace path="/" />
    <Signup path="/signup" />
  </Router>
}