import { app, Menu, MenuItem, MenuItemConstructorOptions } from "electron";
import { createAboutWindow } from "./about";

const isMac = process.platform === "darwin";

const appMenu: (MenuItemConstructorOptions | MenuItem)[] = isMac
  ? [
      {
        label: app.name,
        submenu: [
          { role: "about" },
          { type: "separator" },
          { role: "services" },
          { type: "separator" },
          { role: "hide" },
          { role: "hideOthers" },
          { role: "unhide" },
          { type: "separator" },
          { role: "quit" },
        ],
      },
    ]
  : [];

const editMenu: (MenuItemConstructorOptions | MenuItem)[] = isMac
  ? [
      {
        label: "Edit",
        submenu: [
          { role: "undo" },
          { role: "redo" },
          { type: "separator" },
          { role: "cut" },
          { role: "copy" },
          { role: "paste" },
          { role: "pasteAndMatchStyle" },
          { role: "delete" },
          { role: "selectAll" },
          { type: "separator" },
          {
            label: "Speech",
            submenu: [{ role: "startSpeaking" }, { role: "stopSpeaking" }],
          },
        ],
      },
    ]
  : [
      {
        label: "Edit",
        submenu: [
          { role: "undo" },
          { role: "redo" },
          { type: "separator" },
          { role: "cut" },
          { role: "copy" },
          { role: "paste" },
          { role: "delete" },
          { type: "separator" },
          { role: "selectAll" },
        ],
      },
    ];

const windowMenu: (MenuItemConstructorOptions | MenuItem)[] = isMac
  ? [
      {
        label: "Window",
        submenu: [
          { role: "minimize" },
          { role: "zoom" },
          { type: "separator" },
          { role: "front" },
          { type: "separator" },
          { role: "window" },
        ],
      },
    ]
  : [
      {
        label: "Window",
        submenu: [{ role: "minimize" }, { role: "zoom" }, { role: "close" }],
      },
    ];

const template: (MenuItemConstructorOptions | MenuItem)[] = [
  ...appMenu,
  {
    label: "File",
    submenu: [isMac ? { role: "close" } : { role: "quit" }],
  },
  ...editMenu,
  {
    label: "View",
    submenu: [
      { role: "reload" },
      { role: "forceReload" },
      { role: "toggleDevTools" },
      { type: "separator" },
      { role: "resetZoom" },
      { role: "zoomIn" },
      { role: "zoomOut" },
      { type: "separator" },
      { role: "togglefullscreen" },
    ],
  },
  ...windowMenu,
  {
    role: "help",
    submenu: [
      {
        label: "About Skrift",
        click: async () => {
          await shell.openExternal("https://skrift.app");
        },
      },
    ],
  },
];

export const menu = Menu.buildFromTemplate(template);
