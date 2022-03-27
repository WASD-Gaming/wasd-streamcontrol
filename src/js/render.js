const fs = require('fs');
const { ipcRenderer } = require('electron');

// Match Info Items
const p1Name = document.getElementById('p1Name');
const p1Tag = document.getElementById('p1Tag');
const p1Score = document.getElementById('p1Score');
const p1Win = document.getElementById('p1Win');
const p1Loss = document.getElementById('p1Loss');

const p2Name = document.getElementById('p2Name');
const p2Tag = document.getElementById('p2Tag');
const p2Score = document.getElementById('p2Score');
const p2Win = document.getElementById('p2Win');
const p2Loss = document.getElementById('p2Loss');

const round = document.getElementById('round');

const game = document.getElementById('game');
const runback = document.getElementById('runback');

const matcherino = document.getElementById('matcherino');
const noMatcherino = document.getElementById('no-matcherino');

// Message Items
const msg1 = document.getElementById('msg1');
const msg2 = document.getElementById('msg2');
const msg3 = document.getElementById('msg3');

// Commentator Items
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

// Button click handlers
document.querySelector('#saveBtn').addEventListener('click', () => {
  saveContent();
});

document.querySelector('#adjustBtn').addEventListener('click', () => {
});

document.querySelector('#swapBtn').addEventListener('click', () => {
  swapPlayers();
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

function keypress(key) {
  console.log("I don't work for some reason!");
  let e = $.Event('keypress');
  e.key = key;
  $(document).trigger(e);
}

// Navigation click handlers
$('nav a').click(function() {
  // Removing the active marking from all menu items.
  $('nav a').each(function() {
    $(this).removeClass('active');
  });

  // Adding the active marking to the clicked item.
  $(this).addClass('active');

  // Hiding all the tab info
  $('.tab-info .page').each(function() {
    $(this).addClass('hide');
  });

  var strippedText = $(this).text().replace(/[^a-z0-9]/gi, '');
  if (strippedText === 'MatchInfo') {
    $('#match-info').removeClass('hide');
  }
  if (strippedText ==='Messages') {
    $('#messages').removeClass('hide');
  }
  if (strippedText ==='CommentatorsInfo') {
    $('#commentator-info').removeClass('hide');
  }
  if (strippedText ==='WinnersBracket') {
    $('#winners').removeClass('hide');
  }
  if (strippedText ==='LosersBracket') {
    $('#losers').removeClass('hide');
  }
});

function saveContent() {
  let json = {
    p1Name: p1Name.value,
    p1Tag: p1Tag.value,
    p1Score: p1Score.value,
    p1Win: p1Win.checked,
    p1Loss: p1Loss.checked,
    p2Name: p2Name.value,
    p2Tag: p2Tag.value,
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

  let notification = document.getElementById('notification');
  notification.classList.remove("fade");
  notification.classList.add("fade");
}

function swapPlayers() {
  let player1 = {
    name: p1Name.value,
    tag: p1Tag.value,
    score: p1Score.value,
    win: p1Win.checked,
    loss: p1Loss.checked
  }

  let player2 = {
    name: p2Name.value,
    tag: p2Tag.value,
    score: p2Score.value,
    win: p2Win.checked,
    loss: p2Loss.checked
  }

  p1Name.value = player2.name;
  p1Tag.value = player2.tag;
  p1Score.value = player2.score;
  p1Win.checked = player2.win;
  p1Loss.checked = player2.loss;

  p2Name.value = player1.name;
  p2Tag.value = player1.tag;
  p2Score.value = player1.score;
  p2Win.ckecked = player1.win;
  p2Loss.checked = player1.loss;
}

function resetScores() {
  p1Score.value = 0;
  p2Score.value = 0;
}

function clearFields() {
  p1Name.value = '';
  p1Tag.value = '';
  p1Score.value = 0;
  p1Win.checked = false;
  p1Loss.checked = false;

  p2Name.value = '';
  p2Tag.value = '';
  p2Score.value = 0;
  p2Win.ckecked = false;
  p2Loss.checked = false;
}

// Hotkey handling
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

ipcRenderer.on('load-state', (event, arg) => {
  let rawdata = fs.readFileSync('streamcontrol.json');
  let data = JSON.parse(rawdata);

  p1Name.value = data.p1Name;
  p1Tag.value = data.p1Tag;
  p1Score.value = data.p1Score;
  p1Win.checked = data.p1Win;
  p1Loss.checked = data.p1Loss;

  p2Name.value = data.p2Name;
  p2Tag.value = data.p2Tag;
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
