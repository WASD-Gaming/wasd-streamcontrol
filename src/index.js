const { app, BrowserWindow, globalShortcut } = require('electron');
const path = require('path');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  // eslint-disable-line global-require
  app.quit();
}

let webContents;

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1130,
    height: 850,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
  webContents = mainWindow.webContents;

  // Hacky way to reload the last state of the app.
  webContents.once('dom-ready', () => {
    let data = {'_': '_'};
    webContents.send('load-state', data);
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  createWindow();

  let data = {'_': '_'};
  registerHotkeys(data);
});

function registerHotkeys(data) {
  globalShortcut.register('F24', () => {
    webContents.send('save-action', data);
  });

  globalShortcut.register('F20', () => {
    webContents.send('p1-score-up', data);
  });

  globalShortcut.register('F21', () => {
    webContents.send('p1-score-down', data);
  });

  globalShortcut.register('F22', () => {
    webContents.send('p2-score-up', data);
  });

  globalShortcut.register('F23', () => {
    webContents.send('p2-score-down', data);
  });
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }

  let data = {'_': '_'};
  webContents.send('load-state', data);
});

app.on('will-quit', () => {

  // Hacky way to save the state of the app.
  let data = {'_': '_'};
  webContents.send('save-action', data);

  // Unregister all shortcuts.
  globalShortcut.unregisterAll();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
