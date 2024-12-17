import { app, BrowserWindow, Menu } from "electron";
import { autoUpdater } from "electron-updater";
import * as Sentry from "@sentry/electron/main";
import { setupIpc } from "./ipc";
import { menu } from "./menu";

Sentry.init({
  dsn:
    "https://eea1db58ec474ff4a340a40b9af0a194@o522122.ingest.sentry.io/5633132",
  defaultIntegrations: false,
});

let mainWindow: Electron.BrowserWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      spellcheck: false,
    },
  });

  mainWindow.maximize();

  if (app.isPackaged) {
    mainWindow.loadFile("./build/app.html");
  } else {
    mainWindow.loadURL("http://localhost:8080/app.html").then(() => {
      mainWindow.webContents.openDevTools();
    });
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
