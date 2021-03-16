import { app, BrowserWindow, Menu } from "electron";
import { autoUpdater } from "electron-updater";
import { setupErrors } from "../errors";
import { setupIpc } from "./ipc";
import { menu } from "./menu";

setupErrors();

let mainWindow: Electron.BrowserWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
  });

  mainWindow.maximize();

  if (app.isPackaged) {
    mainWindow.loadFile("./build/app.html");
  } else {
    mainWindow.loadURL("http://localhost:8080/app.html");
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on("closed", () => {
    mainWindow.destroy();
  });
}

Menu.setApplicationMenu(menu);

app.on("ready", () => {
  autoUpdater.checkForUpdatesAndNotify();

  createWindow();
});

app.on("window-all-closed", () => {
  app.quit();
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});

setupIpc();
