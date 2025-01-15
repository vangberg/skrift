import { app, BrowserWindow, Menu } from "electron";
import { autoUpdater } from "electron-updater";
import { setupIpc } from "./ipc.js";
import { menu } from "./menu.js";

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
