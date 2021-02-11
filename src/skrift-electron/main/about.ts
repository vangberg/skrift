import { BrowserWindow } from "electron";
import isDev from "electron-is-dev";

export const createAboutWindow = () => {
  const window = new BrowserWindow({
    width: 600,
    height: 400,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  window.setMenu(null);

  if (isDev) {
    window.loadURL("http://localhost:8080/about.html");
  } else {
    window.loadFile("./build/about.html");
  }

  window.on("closed", () => {
    window.destroy();
  });

  return window;
};
