import { app, BrowserWindow } from "electron";

export const createAboutWindow = () => {
  const window = new BrowserWindow({
    width: 600,
    height: 400,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  window.setMenu(null);

  if (app.isPackaged) {
    window.loadFile("./build/about.html");
  } else {
    window.loadURL("http://localhost:8080/about.html");
  }

  window.on("closed", () => {
    window.destroy();
  });

  return window;
};
