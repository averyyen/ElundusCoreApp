const { app, BrowserWindow, Menu, session, ipcMain } = require("electron");
const isDev = require("electron-is-dev");
const shell = require("electron").shell;
const { autoUpdater } = require("electron-updater");
const path = require("path");

require("./server/index.js");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 700,
    show: false,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    resizable: false,
  });

  const startURL = isDev
    ? "http://localhost:3000"
    : `file://${path.join(__dirname, "../build/index.html")}`;

  mainWindow.loadURL(startURL);

  mainWindow.once("ready-to-show", () => mainWindow.show());
  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  // Deprecated, but didn't find a better way how to force links to open in default browser
  mainWindow.webContents.on("new-window", function (e, url) {
    e.preventDefault();
    shell.openExternal(url);
  });

  ipcMain.on("close-app", (evt, arg) => {
    app.quit();
  });

  ipcMain.on("minimize-app", (evt, arg) => {
    mainWindow.minimize();
  });
}

// Menu
const application = {
  label: "Application",
  submenu: [
    {
      label: "About Application",
      selector: "orderFrontStandardAboutPanel:",
    },
    {
      type: "separator",
    },
    {
      label: "Quit",
      accelerator: "Command+Q",
      click: () => {
        app.quit();
      },
    },
  ],
};

const view = {
  label: "View",
  submenu: [
    {
      role: "reload",
    },
    {
      type: "separator",
    },
    {
      role: "resetzoom",
    },
    {
      role: "zoomin",
    },
    {
      role: "zoomout",
    },
  ],
};

const dev = {
  label: "Dev",
  submenu: [
    {
      role: "toggledevtools",
    },
  ],
};

const edit = {
  label: "Edit",
  submenu: [
    {
      label: "Undo",
      accelerator: "CmdOrCtrl+Z",
      selector: "undo:",
    },
    {
      label: "Redo",
      accelerator: "Shift+CmdOrCtrl+Z",
      selector: "redo:",
    },
    {
      type: "separator",
    },
    {
      label: "Cut",
      accelerator: "CmdOrCtrl+X",
      selector: "cut:",
    },
    {
      label: "Copy",
      accelerator: "CmdOrCtrl+C",
      selector: "copy:",
    },
    {
      label: "Paste",
      accelerator: "CmdOrCtrl+V",
      selector: "paste:",
    },
    {
      label: "Select All",
      accelerator: "CmdOrCtrl+A",
      selector: "selectAll:",
    },
  ],
};

const help = {
  role: "help",
  submenu: [
    {
      label: "Report issue",
      click() {
        shell.openExternal("https://github.com/SietseTrommelen/ElundusCoreApp");
      },
    },
    {
      label: "Version " + app.getVersion(),
      enabled: false,
    },
  ],
};

const template = isDev
  ? [application, edit, view, dev, help]
  : [application, edit, view, help];

Menu.setApplicationMenu(Menu.buildFromTemplate(template));

app.on("ready", createWindow);

// Auto updater
if (!isDev) {
  app.on("ready", function () {
    autoUpdater.checkForUpdatesAndNotify();
  });
}
