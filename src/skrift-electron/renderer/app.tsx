import React from "react";
import { AppContainer } from "./containers/AppContainer";
import { createRoot } from "react-dom/client";
import { EventEmitter } from "events";

import "./styles.css";
import { setupErrors } from "../errors";

setupErrors();

EventEmitter.defaultMaxListeners = 250;

window.skriftDebug = false;

// Get the container
const container = document.getElementById("app");
if (!container) throw new Error("Failed to find the root element");

// Create a root
const root = createRoot(container);

// Initial render
root.render(<AppContainer />);
