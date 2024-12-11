import React from "react";
import * as Sentry from "@sentry/electron/renderer";
import { AppContainer } from "./containers/AppContainer";
import { createRoot } from "react-dom/client";
import { EventEmitter } from "events";

import "./styles.css";

Sentry.init()

EventEmitter.defaultMaxListeners = 250;

window.skriftDebug = false;

// Get the container
const container = document.getElementById("app");
if (!container) throw new Error("Failed to find the root element");

// Create a root
const root = createRoot(container);

// Initial render
root.render(<AppContainer />);
