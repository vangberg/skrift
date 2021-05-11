import React from "react";
import { AppContainer } from "./containers/AppContainer";
import ReactDOM from "react-dom";
import { EventEmitter } from "events";

import "./styles.css";
import { setupErrors } from "../errors";
import { enableMapSet } from "immer";

setupErrors();
enableMapSet();

EventEmitter.defaultMaxListeners = 250;

window.skriftDebug = false;

ReactDOM.render(<AppContainer />, document.getElementById("app"));
