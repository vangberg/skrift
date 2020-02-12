import { app, BrowserWindow } from "electron";

function createWindow() {
  // Create the browser window.
  let win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true
    }
  });

  // and load the index.html of the app.
  win.loadURL("http://localhost:8080");
}

app.on("ready", createWindow);
