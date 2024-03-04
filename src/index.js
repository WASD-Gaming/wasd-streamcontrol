const { app, BrowserWindow, globalShortcut, ipcMain, Menu, dialog } = require('electron');
const fs = require('fs');
const robot = require('robotjs');
const path = require('path');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  // eslint-disable-line global-require
  app.quit();
}

let webContents;
let apiWindow;

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1330,
    // width: 1630,
    height: 850,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
    icon: 'wasd.ico'
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Open the DevTools. Uncomment this out when not building RC.
  // mainWindow.webContents.openDevTools();
  webContents = mainWindow.webContents;
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
});

ipcMain.on('close-api', (event, arg) => {
  apiWindow.close();
});

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
const template = [
  {
     label: 'File',
     submenu: [
        {
          label: 'Select Save Path...',
          click: async () => {
              selectFilePath();
          }
        },
        {
          label: 'Enter API Keys...',
          click: async () => {
              enterAPIKeys();
          }
        },
        { type: 'separator' },
        {
          role: 'quit'
        }
     ]
  },
  
  {
     label: 'Help',
     submenu: [
        {
          label: 'Discord',
          click: async() => {
            require('electron').shell.openExternal('https://discord.gg/wasdgaming-gg-669890850511257620');
          }
        }
     ]
  }
]

async function selectFilePath() {
  let filePath = await dialog.showOpenDialog(
    {
      properties: ['openDirectory']
    }
  );

  console.log(app.getPath('userData'));

  global.sharedData = {
    savePath: filePath.filePaths[0]
  }
  console.log(global.sharedData.savePath);
  let string = {
    savePath: filePath.filePaths[0]
  }
  let sData = JSON.stringify(string);
  fs.writeFileSync(app.getPath('userData') + '\\' + 'settings.json', sData); 

  try {
    if (!fs.existsSync(filePath.filePaths[0] + '\\' + 'autocomplete.json')) {
      //Autocomplete file does not exist so create the empty template.
      let template = {
        "players": [
        ],
        "teams": [
        ],
        "rounds": [
        ]
      }
      let stringedJSON = JSON.stringify(template, null, 4);
      try {
        fs.writeFileSync(filePath.filePaths[0] + '\\' + 'autocomplete.json', stringedJSON)
        console.log('Saved autocomplete!');
      }
      catch(e) {
        alert('Failed to save the file !');
        console.log(e);
      }
    }
  } catch(err) {
    console.error(err)
  }
}

async function enterAPIKeys() {
  apiWindow = new BrowserWindow({
    height: 300,
    width: 600,
    show: true,
    minimizable: false,
    maximizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
    icon: 'wasd.ico',
  });

  apiWindow.removeMenu();
  apiWindow.loadFile(path.join(__dirname, 'apis.html'));
}

ipcMain.on('read-user-data', async (event) => {
  const path = app.getPath('userData');
  event.returnValue = path;
})

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)