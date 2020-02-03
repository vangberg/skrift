import React from "react";
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'
import * as firebase from 'firebase/app'

const uiConfig = {
  signInFlow: 'popup',
  signInSuccessUrl: '/signedIn',
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
  ]
};

export const SignupContainer: React.FC = () => {
  return (
    <div>
      <h1>Signup</h1>

      <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
    </div>
  );
};