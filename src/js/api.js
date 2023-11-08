const fs = require('fs');
const { ipcRenderer, BrowserWindow } = require('electron');

const challongeAPIKey = document.getElementById('challonge-api-key');
const startAPIKey = document.getElementById('start-api-key');

var savePath = getSavePath();

/* BUTTON CLICK HANDING
This section of code handles the physical button clicks in the app. Assigning buttons
actions via onclick causes weird behavior and so we need to add event listeners
to look for the 'click' action.
*/
document.querySelector('#saveAPIsBtn').addEventListener('click', () => {
    saveKeys();
    closeWindow();
});

document.querySelector('#cancelAPIsBtn').addEventListener('click', () => {
    closeWindow();
});

ipcRenderer.on('load-state', (event, arg) => {
// Pulling the file from the harddrive and converting it to a readable format.
  let rawdata = fs.readFileSync(savePath + '\\keys.json');
  let data = JSON.parse(rawdata);

  challongeAPIKey.value = data.challonge;
  startAPIKey.value = data.start;
});

function saveKeys() {
    try {
        let json = {
            challonge: challongeAPIKey.value,
            start: startAPIKey.value
        }
  
        let stringedJSON = JSON.stringify(json, null, 4);
        console.log(stringedJSON);
  
        try {
          fs.writeFileSync(savePath + '\\keys.json', stringedJSON)
          console.log('Keys Saved!');
        }
        catch(e) { alert('Failed to save the file at ' + savePath + '!'); }
    } catch(err) {
      console.error(err)
    }
}

function closeWindow() {
    ipcRenderer.send('close-api', 'close');
}

function getSavePath() {
    let result = ipcRenderer.sendSync('read-user-data');
    let rawdata = fs.readFileSync(result + '\\' + 'settings.json');
    let data = JSON.parse(rawdata);
    return data.savePath;
  }