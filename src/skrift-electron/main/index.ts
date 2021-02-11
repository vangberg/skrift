import { app, BrowserWindow, Menu } from "electron";
import isDev from "electron-is-dev";
import { setupIpc } from "./ipc";
import { menu } from "./menu";
let mainWindow: Electron.BrowserWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  mainWindow.maximize();

  if (isDev) {
    mainWindow.loadURL("http://localhost:8080/app.html");
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile("./build/app.html");
  }

  mainWindow.on("closed", () => {
    mainWindow.destroy();
  });
}

Menu.setApplicationMenu(menu);

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  app.quit();
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});

setupIpc();
