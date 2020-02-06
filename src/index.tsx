import React from "react";
import ReactDOM from "react-dom";
import firebase from 'firebase'

import * as serviceWorker from "./serviceWorker";
import { Store, StoreContext } from "./store";
import "./styles/tailwind.css";
import { App } from "./app";

window.skriftDebug = false;

const firebaseConfig = {
  apiKey: "AIzaSyD6CNdFWSWWPtemGq4HnH5VrfWb1jjJ-RA",
  authDomain: "skrift.firebaseapp.com",
  databaseURL: "https://skrift.firebaseio.com",
  projectId: "skrift",
  storageBucket: "skrift.appspot.com",
  messagingSenderId: "20215940566",
  appId: "1:20215940566:web:0b159f0ab512cb7b20d077"
};

firebase.initializeApp(firebaseConfig)

const store = new Store();

ReactDOM.render(
  <StoreContext.Provider value={store}>
    <App />
  </StoreContext.Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
