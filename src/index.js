const { app, BrowserWindow, globalShortcut, ipcMain } = require('electron');
const robot = require('robotjs');
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
    // width: 1130,
    width: 1630,
    height: 850,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Open the DevTools. Uncomment this out when not building RC.
  mainWindow.webContents.openDevTools();
  webContents = mainWindow.webContents;

  /* Hacky way to reload the last state of the app. Waits until the front end is loaded then sends
  a notification. */
  webContents.once('dom-ready', () => {
    sendNotification('load-state');
  });
};

/* This method will be called when Electron has finished
 initialization and is ready to create browser windows.
Some APIs can only be used after this event occurs.*/
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

  globalShortcut.register('F19', () => {
    webContents.send('swap-action', data);
  });
}

ipcMain.on('keypress', (event, arg) => {
  // console.log(arg)  // prints the button pressed
  robot.keyTap(arg.toLowerCase());
})

/* Quit when all windows are closed, except on macOS. There, it's common
for applications and their menu bar to stay active until the user quits
explicitly with Cmd + Q.*/
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  /* On OS X it's common to re-create a window in the app when the
  dock icon is clicked and there are no other windows open.*/
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }

  // Loading the previous app state.
  sendNotification('load-state');
});

app.on('will-quit', () => {

  // On app close we quickly save the currently entered info for reloading at next launch.
  sendNotification('save-action');

  // Unregister all global shortcuts on app close.
  globalShortcut.unregisterAll();
});

/* HELPER METHODS
General helper and QoL functions to make the code more ledgible.
*/
function sendNotification(notification) {
  let data = {'_': '_'}; // MUST send a data object for the function to work but I don't care about the info so I'm sending this.
  webContents.send(notification, data);
}

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
