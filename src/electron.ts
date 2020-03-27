import { app, BrowserWindow } from "electron";
import isDev from "electron-is-dev";
let mainWindow: Electron.BrowserWindow;

console.log("dev", isDev);

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true
    }
  });

  mainWindow.maximize();
  if (isDev) {
    mainWindow.loadURL("http://localhost:8080");
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile("index.html");
  }

  mainWindow.on("closed", () => {
    mainWindow.destroy();
  });
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});
