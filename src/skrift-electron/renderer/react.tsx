import React from "react";
import ReactDOM from "react-dom";

import "./styles.css";
import { App } from "./app";
import { EventEmitter } from "events";

EventEmitter.defaultMaxListeners = 250;

window.skriftDebug = false;

ReactDOM.render(<App />, document.getElementById("app"));
