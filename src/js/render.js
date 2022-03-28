const fs = require('fs');
const { ipcRenderer } = require('electron');

// MATCH INFO UI ITEMS
const p1Name = document.getElementById('p1Name');
const p1Team = document.getElementById('p1Team');
const p1Score = document.getElementById('p1Score');
const p1Win = document.getElementById('p1Win');
const p1Loss = document.getElementById('p1Loss');

const p2Name = document.getElementById('p2Name');
const p2Team = document.getElementById('p2Team');
const p2Score = document.getElementById('p2Score');
const p2Win = document.getElementById('p2Win');
const p2Loss = document.getElementById('p2Loss');

const round = document.getElementById('round');

const game = document.getElementById('game');
const runback = document.getElementById('runback');

const matcherino = document.getElementById('matcherino');
const noMatcherino = document.getElementById('no-matcherino');

// MESSAGE UI ITEMS
const msg1 = document.getElementById('msg1');
const msg2 = document.getElementById('msg2');
const msg3 = document.getElementById('msg3');

// COMMENTATOR UI ITEMS
const com1Name = document.getElementById('com1Name');
const com1Twitter = document.getElementById('com1Twitter');
const com2Name = document.getElementById('com2Name');
const com2Twitter = document.getElementById('com2Twitter');

const matcherino1 = document.getElementById('matcherino1');
const matcherino2 = document.getElementById('matcherino2');
const matcherino3 = document.getElementById('matcherino3');
const matcherino4 = document.getElementById('matcherino4');
const matcherino5 = document.getElementById('matcherino5');
const matcherino6 = document.getElementById('matcherino6');

/* BUTTON CLICK HANDING
This section of code handles the physical button clicks in the app. Assigning buttons
actions via onclick causes weird behavior and so we need to add event listeners
to look for the 'click' action.
*/
document.querySelector('#saveBtn').addEventListener('click', () => {
  saveContent();
});

document.querySelector('#adjustBtn').addEventListener('click', () => {
});

document.querySelector('#swapBtn').addEventListener('click', () => {
  swapPlayers();
});

document.querySelector('#swapComBtn').addEventListener('click', () => {
  swapComs();
});

document.querySelector('#resetBtn').addEventListener('click', () => {
  resetScores();
});

document.querySelector('#clearBtn').addEventListener('click', () => {
  clearFields();
});

document.querySelector('#fiveClipBtn').addEventListener('click', () => {
  keypress('F18');
});

document.querySelector('#tenClipBtn').addEventListener('click', () => {
  keypress('F17');
});

document.querySelector('#fifteenClipBtn').addEventListener('click', () => {
  keypress('F9');
});

document.querySelector('#twentyClipBtn').addEventListener('click', () => {
  keypress('F16');
});

document.querySelector('#thirtyClipBtn').addEventListener('click', () => {
  keypress('F15');
});

document.querySelector('#fortyfiveClipBtn').addEventListener('click', () => {
  keypress('F14');
});

document.querySelector('#sixtyClipBtn').addEventListener('click', () => {
  keypress('F13');
});

/* NAVIGATION HANDING
This section of code handles the nav menu on the left. The nav works *very* simply--
basically, there are a group fo divs with different IDs on index.html. Each of these
divs contains the UI for a given tab.

When a tab is clicked, ALL the UI divs are hidden and then the correct one is unhidden.
*/
$('nav a').click(function() {
  // Removing the active marking from all menu items.
  $('nav a').each(function() {
    $(this).removeClass('active');
  });

  // Adding the active marking to the clicked menu item.
  $(this).addClass('active');

  // Hiding all the tab info
  $('.tab-info .page').each(function() {
    $(this).addClass('hide');
  });

  var strippedText = stripText($(this).text());
  switch (strippedText) {
  case 'MatchInfo':
    $('#match-info').removeClass('hide');
    break;
  case 'Messages':
    $('#messages').removeClass('hide');
    break;
  case 'CommentatorsInfo':
    $('#commentator-info').removeClass('hide');
    break;
  case 'WinnersBracket':
    $('#winners').removeClass('hide');
    break;
  case 'LosersBracket':
    $('#losers').removeClass('hide');
    break;
  case 'TweetGenerator':
    $('#commentator-info').removeClass('hide');
    break;
  default:
    generateNotification('Something went wrong and we cannot show your tab.');
  }
});

/* UI CHANGE HANDING
These functions all modify the front end in some way. In general, they move
the text around on screen for easy swapping of commentators or players but
there are also other helpers that increment and decrement the score etc.
*/
function swapPlayers() {
  let player1 = {
    name: p1Name.value,
    team: p1Team.value,
    score: p1Score.value,
    win: p1Win.checked,
    loss: p1Loss.checked
  }

  let player2 = {
    name: p2Name.value,
    team: p2Team.value,
    score: p2Score.value,
    win: p2Win.checked,
    loss: p2Loss.checked
  }

  p1Name.value = player2.name;
  p1Team.value = player2.team;
  p1Score.value = player2.score;
  p1Win.checked = player2.win;
  p1Loss.checked = player2.loss;

  p2Name.value = player1.name;
  p2Team.value = player1.team;
  p2Score.value = player1.score;
  p2Win.ckecked = player1.win;
  p2Loss.checked = player1.loss;
}

function swapComs() {
  let com1 = {
    name: com1Name.value,
    twitter: com1Twitter.value
  }

  let com2 = {
    name: com2Name.value,
    twitter: com2Twitter.value
  }

  com1Name.value = com2.name;
  com1Twitter.value = com2.twitter;

  com2Name.value = com1.name;
  com2Twitter.value = com1.twitter;
}

function resetScores() {
  p1Score.value = 0;
  p2Score.value = 0;
}

function clearFields() {
  p1Name.value = '';
  p1Team.value = '';
  p1Score.value = 0;
  p1Win.checked = false;
  p1Loss.checked = false;

  p2Name.value = '';
  p2Team.value = '';
  p2Score.value = 0;
  p2Win.ckecked = false;
  p2Loss.checked = false;
}

/* HOTKEY HANDING
All hotkeys MUST be registered in index.js to make them availible globally
(ie. when the app is in the background). These methods below are just the
handlers. They listen for a specific notification and then call a method that
triggers a UI change or saves to streamcontrol.json.
*/
ipcRenderer.on('save-action', (event, arg) => {
  saveContent();
});

ipcRenderer.on('adjust-action', (event, arg) => {
  console.log('Adjust!')
});

ipcRenderer.on('swap-action', (event, arg) => {
  swapPlayers();
});

ipcRenderer.on('reset-action', (event, arg) => {
  resetScores();
});

ipcRenderer.on('clear-action', (event, arg) => {
  clearFields();
});

ipcRenderer.on('p1-score-up', (event, arg) => {
  p1Score.stepUp();
});

ipcRenderer.on('p1-score-down', (event, arg) => {
  p1Score.stepDown();
});

ipcRenderer.on('p2-score-up', (event, arg) => {
  p2Score.stepUp();
});

ipcRenderer.on('p2-score-down', (event, arg) => {
  p2Score.stepDown();
});

/* APP SAVE STATE HANDING
This method saves the last set of info into the streamcontrol.json file. I'm sure
there are 'better' and cleaner ways to handle this, but the app is so simple it
doesn't really warrant anything more complex.
*/
function saveContent() {
  let json = {
    p1Name: p1Name.value,
    p1Team: p1Team.value,
    p1Score: p1Score.value,
    p1Win: p1Win.checked,
    p1Loss: p1Loss.checked,
    p2Name: p2Name.value,
    p2Team: p2Team.value,
    p2Score: p2Score.value,
    p2Win: p2Win.checked,
    p2Loss: p2Loss.checked,
    round: round.value,
    game: game.value,
    runback: runback.checked,
    matcherino: matcherino.value,
    msg1: msg1.value,
    msg2: msg2.value,
    msg3: msg3.value,
    com1Name: com1Name.value,
    com1Twitter: com1Twitter.value,
    com2Name: com2Name.value,
    com2Twitter: com2Twitter.value,
    matcherino1: matcherino1.value,
    matcherino2: matcherino2.value,
    matcherino3: matcherino3.value,
    matcherino4: matcherino4.value,
    matcherino5: matcherino5.value,
    matcherino6: matcherino6.value
  };
  let stringedJSON = JSON.stringify(json, null, 4);
  console.log(stringedJSON);
  try {
    fs.writeFileSync('streamcontrol.json', stringedJSON)
    console.log('Saved!');
  }
  catch(e) { alert('Failed to save the file !'); }

  generateNotification('Info saved!');
}

/* APP LOAD STATE HANDING
This method pulls the last set of info saved in the streamcontrol.json file
and loads it into the fields of the app. I'm sure there are 'better' and
cleaner ways to handle this, but the app is so simple it doesn't really warrant
anything more complex.
*/
ipcRenderer.on('load-state', (event, arg) => {
  // Pulling the file from the harddrive and converting it to a readable format.
  let rawdata = fs.readFileSync('streamcontrol.json');
  let data = JSON.parse(rawdata);

  // Inserting the data from the file into the UI.
  p1Name.value = data.p1Name;
  p1Team.value = data.p1Team;
  p1Score.value = data.p1Score;
  p1Win.checked = data.p1Win;
  p1Loss.checked = data.p1Loss;

  p2Name.value = data.p2Name;
  p2Team.value = data.p2Team;
  p2Score.value = data.p2Score;
  p2Win.checked = data.p2Win;
  p2Loss.checked = data.p2Loss;

  game.value = data.game;
  round.value = data.round;
  matcherino.value = data.matcherino;

  msg1.value = data.msg1;
  msg2.value = data.msg2;
  msg3.value = data.msg3;

  com1Name.value = data.com1Name;
  com1Twitter.value = data.com1Twitter;
  com2Name.value = data.com2Name;
  com2Twitter.value = data.com2Twitter;

  matcherino1.value = data.matcherino1;
  matcherino2.value = data.matcherino2;
  matcherino3.value = data.matcherino3;
  matcherino4.value = data.matcherino4;
  matcherino5.value = data.matcherino5;
  matcherino6.value = data.matcherino6;
});

/* GENERAL HELPER METHODS
These functions are extra helpers that just make life easier and/or the code cleaner
and easier to read.
*/
function generateNotification(text) {
  let notification = document.getElementById('notification');
  notification.innerHTML = text;
  notification.classList.remove("fade");
  notification.classList.add("fade");
}

function stripText(text) {
  return text.replace(/[^a-z0-9]/gi, '');
}

function keypress(key) {
  console.log("I don't work for some reason!");
  let e = $.Event('keypress');
  e.key = key;
  $(document).trigger(e);
}
