const fs = require('fs');
const { app, ipcRenderer, clipboard } = require('electron');
const path = require('path');
const twitter = require('./js/tweet-gen.js');
const autocomplete = require('autocompleter');
const { log } = require('console');

// MATCH INFO UI ITEMS
const p1Name = document.getElementById('p1Name');
const p1Team = document.getElementById('p1Team');
const p1Score = document.getElementById('p1Score');
const p1Win = document.getElementById('p1Win');
const p1Loss = document.getElementById('p1Loss');
const p1Char = document.getElementById('p1Char');

const p2Name = document.getElementById('p2Name');
const p2Team = document.getElementById('p2Team');
const p2Score = document.getElementById('p2Score');
const p2Win = document.getElementById('p2Win');
const p2Loss = document.getElementById('p2Loss');
const p2Char = document.getElementById('p2Char');

const round = document.getElementById('round');
const offline = document.getElementById('offline');

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

const bracket = document.getElementById('bracket');
const tweetMessage = document.getElementById('tweet-message');
const currentCount = document.getElementById('current');

// TOP 8 UI ITEMS
const wsTop1 = document.getElementById('wsTop1');
const wsTop1Score = document.getElementById('wsTop1Score');
const wsTop2 = document.getElementById('wsTop2');
const wsTop2Score = document.getElementById('wsTop2Score');

const wsBottom1 = document.getElementById('wsBottom1');
const wsBottom1Score = document.getElementById('wsBottom1Score');
const wsBottom2 = document.getElementById('wsBottom2');
const wsBottom2Score = document.getElementById('wsBottom2Score');

const wFinals1 = document.getElementById('wFinals1');
const wFinals1Score = document.getElementById('wFinals1Score');
const wFinals2 = document.getElementById('wFinals2');
const wFinals2Score = document.getElementById('wFinals2Score');

const gFinals1 = document.getElementById('gFinals1');
const gFinals1Score = document.getElementById('gFinals1Score');
const gFinals2 = document.getElementById('gFinals2');
const gFinals2Score = document.getElementById('gFinals2Score');

const leTop1 = document.getElementById('leTop1');
const leTop1Score = document.getElementById('leTop1Score');
const leTop2 = document.getElementById('leTop2');
const leTop2Score = document.getElementById('leTop2Score');

const leBottom1 = document.getElementById('leBottom1');
const leBottom1Score = document.getElementById('leBottom1Score');
const leBottom2 = document.getElementById('leBottom2');
const leBottom2Score = document.getElementById('leBottom2Score');

const lqTop1 = document.getElementById('lqTop1');
const lqTop1Score = document.getElementById('lqTop1Score');
const lqTop2 = document.getElementById('lqTop2');
const lqTop2Score = document.getElementById('lqTop2Score');

const lqBottom1 = document.getElementById('lqBottom1');
const lqBottom1Score = document.getElementById('lqBottom1Score');
const lqBottom2 = document.getElementById('lqBottom2');
const lqBottom2Score = document.getElementById('lqBottom2Score');

const lSemis1 = document.getElementById('lSemis1');
const lSemis1Score = document.getElementById('lSemis1Score');
const lSemis2 = document.getElementById('lSemis2');
const lSemis2Score = document.getElementById('lSemis2Score');

const lFinals1 = document.getElementById('lFinals1');
const lFinals1Score = document.getElementById('lFinals1Score');
const lFinals2 = document.getElementById('lFinals2');
const lFinals2Score = document.getElementById('lFinals2Score');

// Autocomplete Variables
var gPlayers = [];
var gTeams = [];
var gRounds = [];
var savePath = getSavePath();
var chars;

// Startgg Update variables
var setID;
var p1ID;
var p2ID;

/* BUTTON CLICK HANDING
This section of code handles the physical button clicks in the app. Assigning buttons
actions via onclick causes weird behavior and so we need to add event listeners
to look for the 'click' action.
*/
document.querySelector('#saveBtn').addEventListener('click', () => {
  saveContent();
});

document.querySelector('#saveSetBtn').addEventListener('click', () => {
  saveSet();
});

document.querySelector('#adjustBtn').addEventListener('click', () => {
});

document.querySelector('#swapBtn').addEventListener('click', () => {
  swapPlayers();
  swapChars();
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

document.querySelector('#col-0').addEventListener('click', () => {
  sortTable(0);
});

document.querySelector('#col-1').addEventListener('click', () => {
  sortTable(1);
});

document.querySelector('#col-2').addEventListener('click', () => {
  sortTable(2);
});

document.querySelector('#col-3').addEventListener('click', () => {
  sortTable(3);
});

document.querySelector('#col-4').addEventListener('click', () => {
  sortTable(4);
});

document.querySelector('#col-5').addEventListener('click', () => {
  sortTable(5);
});

document.querySelector('#col-6').addEventListener('click', () => {
  sortTable(6);
});

document.querySelector('#col-0-sets').addEventListener('click', () => {
  sortSetTable(0);
});

document.querySelector('#col-1-sets').addEventListener('click', () => {
  sortSetTable(1);
});

document.querySelector('#col-2-sets').addEventListener('click', () => {
  sortSetTable(2);
});

document.querySelector('#streamQueueBtn').addEventListener('click', () => {
  populateUpcomingSets();
});

setInterval(populateUpcomingSets, 60000);

document.querySelector('#pushResultsBtn').addEventListener('click', () => {
  let winnerID;
  if (p1Score.value > p2Score.value) winnerID = p1ID;
  else winnerID = p2ID;

  twitter.sendSetResults('update-startgg', bracket.value, setID, winnerID, p1ID, p1Score.value, p2ID, p2Score.value);
});

document.querySelector('#starting-soon').addEventListener('click', () => {
  let p = twitter.generateTweet('starting-soon', matcherino.value, bracket.value, com1Twitter.value, com2Twitter.value, game.value);
  p.then(value => {
    tweetMessage.value = value;
    currentCount.innerHTML = tweetMessage.value.length;
  });
});

document.querySelector('#kickoff').addEventListener('click', () => {
  let p = twitter.generateTweet('kickoff', matcherino.value, bracket.value, com1Twitter.value, com2Twitter.value, game.value);
  p.then(value => {
    tweetMessage.value = value;
    currentCount.innerHTML = tweetMessage.value.length;
  });
});

document.querySelector('#top-16').addEventListener('click', () => {
  let p = twitter.generateTweet('top-16', matcherino.value, bracket.value, com1Twitter.value, com2Twitter.value, game.value);
  p.then(value => {
    tweetMessage.value = value;
    currentCount.innerHTML = tweetMessage.value.length;
  });
});

document.querySelector('#top-8').addEventListener('click', () => {
  let p = twitter.generateTweet('top-8', matcherino.value, bracket.value, com1Twitter.value, com2Twitter.value, game.value);
  p.then(value => {
    tweetMessage.value = value;
    currentCount.innerHTML = tweetMessage.value.length;
  });
});

document.querySelector('#top-4').addEventListener('click', () => {
  let p = twitter.generateTweet('top-4', matcherino.value, bracket.value, com1Twitter.value, com2Twitter.value, game.value);
  p.then(value => {
    tweetMessage.value = value;
    currentCount.innerHTML = tweetMessage.value.length;
  });
});

document.querySelector('#losers-semis').addEventListener('click', () => {
  let p = twitter.generateTweet('losers-semis', matcherino.value, bracket.value, com1Twitter.value, com2Twitter.value, game.value);
  p.then(value => {
    tweetMessage.value = value;
    currentCount.innerHTML = tweetMessage.value.length;
  });
});

document.querySelector('#losers-finals').addEventListener('click', () => {
  let p = twitter.generateTweet('losers-finals', matcherino.value, bracket.value, com1Twitter.value, com2Twitter.value, game.value);
  p.then(value => {
    tweetMessage.value = value;
    currentCount.innerHTML = tweetMessage.value.length;
  });
});

document.querySelector('#grand-finals').addEventListener('click', () => {
  let p = twitter.generateTweet('grand-finals', matcherino.value, bracket.value, com1Twitter.value, com2Twitter.value, game.value);
  p.then(value => {
    tweetMessage.value = value;
    currentCount.innerHTML = tweetMessage.value.length;
  });
});

document.querySelector('#reset').addEventListener('click', () => {
  let p = twitter.generateTweet('reset', matcherino.value, bracket.value, com1Twitter.value, com2Twitter.value, game.value);
  p.then(value => {
    tweetMessage.value = value;
    currentCount.innerHTML = tweetMessage.value.length;
  });
});

document.querySelector('#results').addEventListener('click', () => {
  let p = twitter.generateTweet('results', matcherino.value, bracket.value, com1Twitter.value, com2Twitter.value, game.value);
  p.then(value => {
    tweetMessage.value = value;
    currentCount.innerHTML = tweetMessage.value.length;
  });
});

document.querySelector('#player-list').addEventListener('click', () => {
  let p = twitter.generateTweet('player-list', matcherino.value, bracket.value, com1Twitter.value, com2Twitter.value, game.value);
  p.then(value => {
    tweetMessage.value = value;
    currentCount.innerHTML = tweetMessage.value.length;
  });
});

document.querySelector('#copy').addEventListener('click', () => {
  clipboard.writeText(tweetMessage.value, 'selection');
  generateNotification('Tweet coppied to clipboard!');
});

document.querySelector('#populate-top-8-winners').addEventListener('click', () => {
  let p = twitter.populateTop8('populate-top-8', bracket.value, game.value);
  p.then(value => {
    let winners = value[0]['winners'];
    wsTop1.value = winners[0]['player1'];
    wsTop1Score.value = winners[0]['player1score'];
    wsTop2.value = winners[0]['player2'];
    wsTop2Score.value = winners[0]['player2score'];

    wsBottom1.value = winners[1]['player1'];
    wsBottom1Score.value = winners[1]['player1score'];
    wsBottom2.value = winners[1]['player2'];
    wsBottom2Score.value = winners[1]['player2score'];

    wFinals1.value = winners[2]['player1'];
    wFinals1Score.value = winners[2]['player1score'];
    wFinals2.value = winners[2]['player2'];
    wFinals2Score.value = winners[2]['player2score'];

    gFinals1.value = winners[3]['player1'];
    gFinals1Score.value = winners[3]['player1score'];
    gFinals2.value = winners[3]['player2'];
    gFinals2Score.value = winners[3]['player2score'];

    let losers = value[1]['losers'];
    leTop1.value = losers[0]['player1'];
    leTop1Score.value = losers[0]['player1score'];
    leTop2.value = losers[0]['player2'];
    leTop2Score.value = losers[0]['player2score'];

    leBottom1.value = losers[1]['player1'];
    leBottom1Score.value = losers[1]['player1score'];
    leBottom2.value = losers[1]['player2'];
    leBottom2Score.value = losers[1]['player2score'];

    lqTop1.value = losers[2]['player1'];
    lqTop1Score.value = losers[2]['player1score'];
    lqTop2.value = losers[2]['player2'];
    lqTop2Score.value = losers[2]['player2score'];

    lqBottom1.value = losers[3]['player1'];
    lqBottom1Score.value = losers[3]['player1score'];
    lqBottom2.value = losers[3]['player2'];
    lqBottom2Score.value = losers[3]['player2score'];

    lSemis1.value = losers[4]['player1'];
    lSemis1Score.value = losers[4]['player1score'];
    lSemis2.value = losers[4]['player2'];
    lSemis2Score.value = losers[4]['player2score'];

    lFinals1.value = losers[5]['player1'];
    lFinals1Score.value = losers[5]['player1score'];
    lFinals2.value = losers[5]['player2'];
    lFinals2Score.value = losers[5]['player2score'];
  });
});

document.querySelector('#populate-top-8-losers').addEventListener('click', () => {
  let p = twitter.populateTop8('populate-top-8', bracket.value, game.value);
  p.then(value => {
    let winners = value[0]['winners'];
    wsTop1.value = winners[0]['player1'];
    wsTop1Score.value = winners[0]['player1score'];
    wsTop2.value = winners[0]['player2'];
    wsTop2Score.value = winners[0]['player2score'];

    wsBottom1.value = winners[1]['player1'];
    wsBottom1Score.value = winners[1]['player1score'];
    wsBottom2.value = winners[1]['player2'];
    wsBottom2Score.value = winners[1]['player2score'];

    wFinals1.value = winners[2]['player1'];
    wFinals1Score.value = winners[2]['player1score'];
    wFinals2.value = winners[2]['player2'];
    wFinals2Score.value = winners[2]['player2score'];

    gFinals1.value = winners[3]['player1'];
    gFinals1Score.value = winners[3]['player1score'];
    gFinals2.value = winners[3]['player2'];
    gFinals2Score.value = winners[3]['player2score'];

    let losers = value[1]['losers'];
    leTop1.value = losers[0]['player1'];
    leTop1Score.value = losers[0]['player1score'];
    leTop2.value = losers[0]['player2'];
    leTop2Score.value = losers[0]['player2score'];

    leBottom1.value = losers[1]['player1'];
    leBottom1Score.value = losers[1]['player1score'];
    leBottom2.value = losers[1]['player2'];
    leBottom2Score.value = losers[1]['player2score'];

    lqTop1.value = losers[2]['player1'];
    lqTop1Score.value = losers[2]['player1score'];
    lqTop2.value = losers[2]['player2'];
    lqTop2Score.value = losers[2]['player2score'];

    lqBottom1.value = losers[3]['player1'];
    lqBottom1Score.value = losers[3]['player1score'];
    lqBottom2.value = losers[3]['player2'];
    lqBottom2Score.value = losers[3]['player2score'];

    lSemis1.value = losers[4]['player1'];
    lSemis1Score.value = losers[4]['player1score'];
    lSemis2.value = losers[4]['player2'];
    lSemis2Score.value = losers[4]['player2score'];

    lFinals1.value = losers[5]['player1'];
    lFinals1Score.value = losers[5]['player1score'];
    lFinals2.value = losers[5]['player2'];
    lFinals2Score.value = losers[5]['player2score'];
  });
});

/* GAME SELECT HANDING
This section of code handles the game select dropdown. Basically, changing the game
will also change the list of characters next to a given player's name. We'll then store
this in the JSON for easy tweeting and records.
*/
document.addEventListener('input', function (event) {

	// Only run on our select menu
	if (event.target.id !== 'game') return;

  populateCharacters(event.target.value);

}, false);

function removeOptions(selectElement) {
   var i, L = selectElement.options.length - 1;
   for(i = L; i >= 0; i--) {
      selectElement.remove(i);
   }
}

/* AUTOCOMPLETE HANDLING

The functions below set up autocomplete for the varios app fields. Each of them pull from
"global" arrays that get populat from the autocomplete.json file.
*/

autocomplete({
  minLength: 1,
  input: p1Name,
  fetch: function(text, update) {
        text = text.toLowerCase();
        var suggestions = gPlayers.filter(n => n.label.toLowerCase().startsWith(text))
        update(suggestions);
    },
    onSelect: function(item) {
        p1Name.value = item.value;
    }
});

autocomplete({
  minLength: 1,
  input: p2Name,
  fetch: function(text, update) {
        text = text.toLowerCase();
        var suggestions = gPlayers.filter(n => n.label.toLowerCase().startsWith(text))
        update(suggestions);
    },
    onSelect: function(item) {
        p2Name.value = item.value;
    }
});

autocomplete({
  minLength: 1,
  input: p1Team,
  fetch: function(text, update) {
        text = text.toLowerCase();
        var suggestions = gTeams.filter(n => n.label.toLowerCase().startsWith(text))
        update(suggestions);
    },
    onSelect: function(item) {
        p1Team.value = item.value;
    }
});

autocomplete({
  minLength: 1,
  input: p2Team,
  fetch: function(text, update) {
        text = text.toLowerCase();
        var suggestions = gTeams.filter(n => n.label.toLowerCase().startsWith(text))
        update(suggestions);
    },
    onSelect: function(item) {
        p2Team.value = item.value;
    }
});

autocomplete({
  minLength: 1,
  input: round,
  fetch: function(text, update) {
        text = text.toLowerCase();
        var suggestions = gRounds.filter(n => n.label.toLowerCase().startsWith(text))
        update(suggestions);
    },
    onSelect: function(item) {
        round.value = item.value;
    }
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
    $('#twitter').removeClass('hide');
    break;
  case 'MatchHistory':
    $('#match-history').removeClass('hide');
    populateMatchHistory();
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
    loss: p1Loss.checked,
    playerID: p1ID
  }

  let player2 = {
    name: p2Name.value,
    team: p2Team.value,
    score: p2Score.value,
    win: p2Win.checked,
    loss: p2Loss.checked,
    playerID: p2ID
  }

  p1Name.value = player2.name;
  p1Team.value = player2.team;
  p1Score.value = player2.score;
  p1Win.checked = player2.win;
  p1Loss.checked = player2.loss;
  p1ID = player2.playerID;

  p2Name.value = player1.name;
  p2Team.value = player1.team;
  p2Score.value = player1.score;
  p2Win.ckecked = player1.win;
  p2Loss.checked = player1.loss;
  p2ID = player1.playerID;
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

function swapChars() {
  var p1Chars = [...p1Char.options]
                     .filter(x => x.selected)
                     .map(x => x.value);
      
  var p2Chars = [...p2Char.options]
                    .filter(x => x.selected)
                    .map(x => x.value);

  // This is janky as hell but it was the only way I could think of to check
  // the box on the dropdown with minimal effort.
  removeOptions(p1Char);
  removeOptions(p2Char);

  var sortedChars = chars.sort();
  for (var i = 0; i < sortedChars.length; i++){
    var character = sortedChars[i];
    var element = document.createElement("option");
    element.innerText = character;
    if(p2Chars.includes(character)) element.selected = true;
    p1Char.append(element);
    p1Char.loadOptions();
  }

  for (var i = 0; i < sortedChars.length; i++){
    var character = sortedChars[i];
    var element = document.createElement("option");
    element.innerText = character;
    if(p1Chars.includes(character)) element.selected = true;
    p2Char.append(element);
    p2Char.loadOptions();
  }
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
  p1Char.value = '';
  p1ID = 0

  p2Name.value = '';
  p2Team.value = '';
  p2Score.value = 0;
  p2Win.ckecked = false;
  p2Loss.checked = false;
  p2Char.value = '';
  p2ID = 0

  removeOptions(p1Char);
  removeOptions(p2Char);

  var sortedChars = chars.sort();
  for (var i = 0; i < sortedChars.length; i++){
    var character = sortedChars[i];
    var element = document.createElement("option");
    element.innerText = character;
    p1Char.append(element);
    p1Char.loadOptions();
  }

  for (var i = 0; i < sortedChars.length; i++){
    var character = sortedChars[i];
    var element = document.createElement("option");
    element.innerText = character;
    p2Char.append(element);
    p2Char.loadOptions();
  }
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
  swapChars();
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

/* MATCH HISTORY HANDING
These methods save matches in a new JSON file based on bracket name when "save set" is clicked. 
It then adds it to a table on the Match History tab to be viewed later. Additionally, there is
preliminary sorting work.
*/

function getSavePath() {
  let result = ipcRenderer.sendSync('read-user-data');
  let rawdata = fs.readFileSync(result + '\\' + 'settings.json');
  let data = JSON.parse(rawdata);
  return data.savePath;
}

function saveSet() {
  var bracketParts = bracket.value.split('/');
  let fileName = bracketParts.pop() || bracketParts.pop();

  let roundName = round.value;

  try {
    if (fs.existsSync(savePath + '\\' + fileName + '.json')) {
      //file exists
      let rawdata = fs.readFileSync(savePath + '\\' + fileName + '.json');
      let data = JSON.parse(rawdata);

      var p1Chars = [...p1Char.options]
                     .filter(x => x.selected)
                     .map(x => x.value);
      
      var p2Chars = [...p2Char.options]
                    .filter(x => x.selected)
                    .map(x => x.value);

      if (!(roundName in data) && roundName !== '') {
        data[roundName] = [{
          p1Team: p1Team.value,
          p1Name: p1Name.value,
          p1Score: p1Score.value,
          p1Char: p1Chars,
          p2Team: p2Team.value,
          p2Name: p2Name.value,
          p2Score: p2Score.value,
          p2Char: p2Chars,
        }]

        let stringedJSON = JSON.stringify(data, null, 4);
        try {
          fs.writeFileSync(savePath + '\\' + fileName + '.json', stringedJSON)
          console.log('Saved Set!');
        }
        catch(e) { alert('Failed to save the file !'); }
      } else {
        var p1Chars = [...p1Char.options]
                      .filter(x => x.selected)
                      .map(x => x.value);

        var p2Chars = [...p2Char.options]
                      .filter(x => x.selected)
                      .map(x => x.value);

        data[roundName].push(
          {
          p1Team: p1Team.value,
          p1Name: p1Name.value,
          p1Score: p1Score.value,
          p1Char: p1Chars,
          p2Team: p2Team.value,
          p2Name: p2Name.value,
          p2Score: p2Score.value,
          p2Char: p2Chars,
        }
        );

        let stringedJSON = JSON.stringify(data, null, 4);
        try {
          fs.writeFileSync(savePath + '\\' + fileName + '.json', stringedJSON)
          console.log('Saved Set!');
        }
        catch(e) { alert('Failed to save the file !'); }
      }
    } else {
      var p1Chars = [...p1Char.options]
                    .filter(x => x.selected)
                    .map(x => x.value);

      var p2Chars = [...p2Char.options]
                    .filter(x => x.selected)
                    .map(x => x.value);
      let json = {
        [roundName]: [
          {
            p1Team: p1Team.value,
            p1Name: p1Name.value,
            p1Score: p1Score.value,
            p1Char: p1Chars,
            p2Team: p2Team.value,
            p2Name: p2Name.value,
            p2Score: p2Score.value,
            p2Char: p2Chars,
          }
        ]
      }

      let stringedJSON = JSON.stringify(json, null, 4);
      console.log(stringedJSON);

      try {
        fs.writeFileSync(savePath + '\\' + fileName + '.json', stringedJSON)
        console.log('Saved Set!');
      }
      catch(e) { alert('Failed to save the file !'); }
      }
  } catch(err) {
    console.error(err)
  }
}

function populateMatchHistory() {
  var bracketParts = bracket.value.split('/');
  let fileName = bracketParts.pop() || bracketParts.pop();

  let rawdata = fs.readFileSync(savePath + '\\' + fileName + '.json');
  let data = JSON.parse(rawdata);
  console.log(data);

  let table = document.getElementById('match-table');
  table.tBodies[0].innerHTML = "";

  Object.keys(data).forEach(function(key){
    let round = key;

    data[round].forEach(function(match){
      let tr = document.createElement('tr');
      if(match.p1Score > match.p2Score) {
        tr.innerHTML = '<td>' + round + '</td>' +
        '<td class="winner">' + match.p1Team + ' ' + match.p1Name + '</td>' +
        '<td>' + match.p1Char.join(', ') + '</td>' +
        '<td>' + match.p1Score + '</td>' +
        '<td class="loser">' + match.p2Team + ' ' + match.p2Name + '</td>' +
        '<td>' + match.p2Char.join(', ') + '</td>' +
        '<td>' + match.p2Score + '</td>';
      } else {
        tr.innerHTML = '<td>' + round + '</td>' +
        '<td class="loser">' + match.p1Team + ' ' + match.p1Name + '</td>' +
        '<td>' + match.p1Char.join(', ') + '</td>' +
        '<td>' + match.p1Score + '</td>' +
        '<td class="winner">' + match.p2Team + ' ' + match.p2Name + '</td>' +
        '<td>' + match.p2Char.join(', ') + '</td>' +
        '<td>' + match.p2Score + '</td>';
      }
      table.tBodies[0].appendChild(tr);
    });
  });
}

function updateCurrentMatchHistory() {
  let player1Name = document.getElementById('player1');
  let player1Chars = document.getElementById('player1-chars');
  let player2Name = document.getElementById('player2');
  let player2Chars = document.getElementById('player2-chars');
  let runbackResult = document.getElementById('runback-result');
  let firstMeet = document.getElementById('first-meet');

  player1Name.innerHTML = p1Name.value;
  player1Chars.innerHTML = getCharactersForPlayer(p1Name.value).join(', ');
  player2Name.innerHTML = p2Name.value;
  player2Chars.innerHTML = getCharactersForPlayer(p2Name.value).join(', ');

  if (isRunback(p1Name.value, p2Name.value)) runbackResult.innerHTML = 'YES';
  else runbackResult.innerHTML = 'NO';

  let previousMatches = getFormerMatchResults(p1Name.value, p2Name.value);
  if (previousMatches.length == 0) firstMeet.innerHTML = 'N/A'; 
  else if (previousMatches.length > 0) {
    let previousMatchString = '';
    previousMatches.forEach(function(match){
      previousMatchString = previousMatchString + match.p1Name + ' ' + match.p1Score + ' - ' + match.p2Name + ' ' + match.p2Score + '<br>';
    });
    firstMeet.innerHTML = previousMatchString;
  }
}

function getCharactersForPlayer(player) {
  try {
    var bracketParts = bracket.value.split('/');
    let fileName = bracketParts.pop() || bracketParts.pop();
    let filePath = savePath + '\\' + fileName + '.json';

    // Check if the file exists before trying to read it
    if (!fs.existsSync(filePath)) {
      console.error(`File not found: ${filePath}`);
      return [];
    }

    let rawdata = fs.readFileSync(filePath);
    let data = JSON.parse(rawdata);
    let characters = [];

    // Ensure the data is in the expected format
    if (typeof data !== 'object' || data === null) {
      console.error('Data format is invalid.');
      return [];
    }

    // Looping through all of the saved sets to see what characters a given player has played.
    Object.keys(data).forEach(function(key) {
      let round = key;

      if (Array.isArray(data[round])) {
        data[round].forEach(function(match) {
          if (match.p1Name?.toUpperCase() === player.toUpperCase()) {
            // Sorting out duplicate entries of the same character
            match.p1Char?.forEach(function(character) {
              if (character && !characters.includes(character)) characters.push(character);
            });
          }
          if (match.p2Name?.toUpperCase() === player.toUpperCase()) {
            // Sorting out duplicate entries of the same character
            match.p2Char?.forEach(function(character) {
              if (character && !characters.includes(character)) characters.push(character);
            });
          }
        });
      }
    });

    if (characters.length == 0) return ['??'];

    return characters;
  } catch (error) {
    console.error('Error reading or parsing file:', error);
    return [];
  }
}


function isRunback(player1, player2){
  var bracketParts = bracket.value.split('/');
  let fileName = bracketParts.pop() || bracketParts.pop();

  let rawdata = fs.readFileSync(savePath + '\\' + fileName + '.json');
  let data = JSON.parse(rawdata);

  let result = false;
  
  // Looping through all of the saved sets to see if the players have played before.
  Object.keys(data).forEach(function(key){
    let round = key;

    data[round].forEach(function(match){
      if(match.p1Name.toUpperCase() === player1.toUpperCase() && match.p2Name.toUpperCase() === player2.toUpperCase()) {
        result = true;
      }
      if(match.p1Name.toUpperCase() === player2.toUpperCase() && match.p2Name.toUpperCase() === player1.toUpperCase()) {
        result = true;
      }
    });
  });

  return result;
}

function getFormerMatchResults(player1, player2) {
  var bracketParts = bracket.value.split('/');
  let fileName = bracketParts.pop() || bracketParts.pop();

  let rawdata = fs.readFileSync(savePath + '\\' + fileName + '.json');
  let data = JSON.parse(rawdata);

  let result = [];
  
  // Looping through all of the saved sets to see if the players have played before.
  Object.keys(data).forEach(function(key){
    let round = key;

    data[round].forEach(function(match){
      if(match.p1Name.toUpperCase() === player1.toUpperCase() && match.p2Name.toUpperCase() === player2.toUpperCase()) {
        result.push(match);
      }
      if(match.p1Name.toUpperCase() === player2.toUpperCase() && match.p2Name.toUpperCase() === player1.toUpperCase()) {
        result.push(match);
      }
    });
  });

  return result;
}

function sortTable(n) {
  var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
  table = document.getElementById("match-table");
  switching = true;
  // Set the sorting direction to ascending:
  dir = "asc";
  /* Make a loop that will continue until
  no switching has been done: */
  while (switching) {
    // Start by saying: no switching is done:
    switching = false;
    rows = table.rows;
    /* Loop through all table rows (except the
    first, which contains table headers): */
    for (i = 1; i < (rows.length - 1); i++) {
      // Start by saying there should be no switching:
      shouldSwitch = false;
      /* Get the two elements you want to compare,
      one from current row and one from the next: */
      x = rows[i].getElementsByTagName("TD")[n];
      y = rows[i + 1].getElementsByTagName("TD")[n];
      /* Check if the two rows should switch place,
      based on the direction, asc or desc: */
      if (dir == "asc") {
        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
          // If so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      } else if (dir == "desc") {
        if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
          // If so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      /* If a switch has been marked, make the switch
      and mark that a switch has been done: */
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      // Each time a switch is done, increase this count by 1:
      switchcount ++;
    } else {
      /* If no switching has been done AND the direction is "asc",
      set the direction to "desc" and run the while loop again. */
      if (switchcount == 0 && dir == "asc") {
        dir = "desc";
        switching = true;
      }
    }
  }
}

/* UPCOMING SETS HANDING
These methods handle the upcoming sets table. Additionally, there is preliminary sorting work.
*/

function populateUpcomingSets() {
  let table = document.getElementById('set-table');
  table.tBodies[0].innerHTML = "";

  let p = twitter.getStreamQueue('stream-queue', bracket.value);
  p.then(value => {
    value.forEach(function(set){
      let round = set.round;

      // Modify the round name based on the conditions
      if (round.toLowerCase().includes('semi-final')) {
        round = round.replace(/Semi-Final/i, 'Semifinal');
      } else if (round.toLowerCase().endsWith('final')) {
        round = round.replace(/Final/i, 'Finals');
      }
  
      let tr = document.createElement('tr');
      tr.dataset.id = set.id; // Storing the id for use when updating Startgg
      tr.dataset.round = round;
      tr.dataset.p1Tag = set.player1Tag;
      tr.dataset.p1Name = set.player1Name;
      tr.dataset.p1ID = set.player1ID;
      tr.dataset.p2Tag = set.player2Tag;
      tr.dataset.p2Name = set.player2Name;
      tr.dataset.p2ID = set.player2ID;

      let player1Content = set.player1Tag ? `${set.player1Tag} | ${set.player1Name}` : set.player1Name;
      let player2Content = set.player2Tag ? `${set.player2Tag} | ${set.player2Name}` : set.player2Name;
        
      tr.innerHTML = `<td>${round}</td>
                      <td>${player1Content}</td>
                      <td>${player2Content}</td>`;
        
      table.tBodies[0].appendChild(tr);
    });

    table.tBodies[0].addEventListener('click', function(event) {
      clearFields(); // To clear out old character selections
      const target = event.target;
      const row = target.closest('tr');

      if (row) {
        setID = row.dataset.id;
        round.value = row.dataset.round;
        p1Team.value = row.dataset.p1Tag;
        p1Name.value = row.dataset.p1Name;
        p1ID = row.dataset.p1ID;
        p1Score.value = 0
        p2Team.value = row.dataset.p2Tag;
        p2Name.value = row.dataset.p2Name;
        p2ID = row.dataset.p2ID;
        p2Score.value = 0
      }

      saveContent(); // Saving content to update the overlay
    });

  });
}

function sortSetTable(n) {
  var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
  table = document.getElementById("set-table");
  switching = true;
  // Set the sorting direction to ascending:
  dir = "asc";
  /* Make a loop that will continue until
  no switching has been done: */
  while (switching) {
    // Start by saying: no switching is done:
    switching = false;
    rows = table.rows;
    /* Loop through all table rows (except the
    first, which contains table headers): */
    for (i = 1; i < (rows.length - 1); i++) {
      // Start by saying there should be no switching:
      shouldSwitch = false;
      /* Get the two elements you want to compare,
      one from current row and one from the next: */
      x = rows[i].getElementsByTagName("TD")[n];
      y = rows[i + 1].getElementsByTagName("TD")[n];
      /* Check if the two rows should switch place,
      based on the direction, asc or desc: */
      if (dir == "asc") {
        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
          // If so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      } else if (dir == "desc") {
        if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
          // If so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      /* If a switch has been marked, make the switch
      and mark that a switch has been done: */
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      // Each time a switch is done, increase this count by 1:
      switchcount ++;
    } else {
      /* If no switching has been done AND the direction is "asc",
      set the direction to "desc" and run the while loop again. */
      if (switchcount == 0 && dir == "asc") {
        dir = "desc";
        switching = true;
      }
    }
  }
}

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
    offline: offline.checked,
    matcherino: matcherino.value,
    'no-matcherino': noMatcherino.value,
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
    matcherino6: matcherino6.value,
    bracket: bracket.value,
    wsTop1: wsTop1.value,
    wsTop1Score: wsTop1Score.value,
    wsTop2: wsTop2.value,
    wsTop2Score: wsTop2Score.value,
    wsBottom1: wsBottom1.value,
    wsBottom1Score: wsBottom1Score.value,
    wsBottom2: wsBottom2.value,
    wsBottom2Score: wsBottom2Score.value,
    wFinals1: wFinals1.value,
    wFinals1Score: wFinals1Score.value,
    wFinals2: wFinals2.value,
    wFinals2Score: wFinals2Score.value,
    gFinals1: gFinals1.value,
    gFinals1Score: gFinals1Score.value,
    gFinals2: gFinals2.value,
    gFinals2Score: gFinals2Score.value,
    leTop1: leTop1.value,
    leTop1Score: leTop1Score.value,
    leTop2: leTop2.value,
    leTop2Score: leTop2Score.value,
    leBottom1: leBottom1.value,
    leBottom1Score: leBottom1Score.value,
    leBottom2: leBottom2.value,
    leBottom2Score: leBottom2Score.value,
    lqTop1: lqTop1.value,
    lqTop1Score: lqTop1Score.value,
    lqTop2: lqTop2.value,
    lqTop2Score: lqTop2Score.value,
    lqBottom1: lqBottom1.value,
    lqBottom1Score: lqBottom1Score.value,
    lqBottom2: lqBottom2.value,
    lqBottom2Score: lqBottom2Score.value,
    lSemis1: lSemis1.value,
    lSemis1Score: lSemis1Score.value,
    lSemis2: lSemis2.value,
    lSemis2Score: lSemis2Score.value,
    lFinals1: lFinals1.value,
    lFinals1Score: lFinals1Score.value,
    lFinals2: lFinals2.value,
    lFinals2Score: lFinals2Score.value,
    setID: setID,
    p1ID: p1ID,
    p2ID: p2ID
  };
  let stringedJSON = JSON.stringify(json, null, 4);
  console.log(stringedJSON);
  try {
    fs.writeFileSync(savePath + '\\' + 'streamcontrol.json', stringedJSON)
    console.log('Saved!');
  }
  catch(e) { alert('Failed to save the file at ' + savePath + '\\' + 'streamcontrol.json' + '!'); }

  generateNotification('Info saved!');
  saveForAutocomplete();
  updateCurrentMatchHistory();
}

function saveForAutocomplete() {
  let rawdata = fs.readFileSync(savePath + '\\' + 'autocomplete.json');
  let data = JSON.parse(rawdata);

  let players = data.players;
  let teams = data.teams;
  let rounds = data.rounds;

  if (!players.includes(p1Name.value) && p1Name.value !== '') players.push(p1Name.value);
  if (!players.includes(p2Name.value) && p2Name.value !== '') players.push(p2Name.value);
  if (!teams.includes(p1Team.value) && p1Team.value !== '') teams.push(p1Team.value);
  if (!teams.includes(p2Team.value) && p2Team.value !== '') teams.push(p2Team.value);
  if (!rounds.includes(round.value) && round.value !== '') rounds.push(round.value);

  let json = {
    "players": players,
    "teams": teams,
    "rounds": rounds
  }

  formatPlayersArray(players);
  formatTeamsArray(teams);
  formatRoundsArray(rounds);

  let stringedJSON = JSON.stringify(json, null, 4);
  try {
    fs.writeFileSync(savePath + '\\' + 'autocomplete.json', stringedJSON)
    console.log('Saved autocomplete!');
  }
  catch(e) {
    alert('Failed to save the file !');
    console.log(e);
  }
}

function formatPlayersArray(players) {
  gPlayers = [];
  for (var i = 0; i < players.length; i++) {
    var dict = {label: players[i], value: players[i]}
    gPlayers.push(dict);
  }
}

function formatTeamsArray(teams) {
  gTeams = [];
  for (var i = 0; i < teams.length; i++) {
    var dict = {label: teams[i], value: teams[i]}
    gTeams.push(dict);
  }
}

function formatRoundsArray(rounds) {
  gRounds = [];
  for (var i = 0; i < rounds.length; i++) {
    var dict = {label: rounds[i], value: rounds[i]}
    gRounds.push(dict);
  }
}

/* APP LOAD STATE HANDING
This method pulls the last set of info saved in the streamcontrol.json file
and loads it into the fields of the app. I'm sure there are 'better' and
cleaner ways to handle this, but the app is so simple it doesn't really warrant
anything more complex.
*/

document.addEventListener("DOMContentLoaded", (event) => {
  // Pulling the file from the harddrive and converting it to a readable format.
  let rawdata = fs.readFileSync(savePath + '\\streamcontrol.json');
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

  bracket.value = data.bracket;

  wsTop1.value = data.wsTop1;
  wsTop1Score.value = data.wsTop1Score;
  wsTop2.value = data.wsTop2;
  wsTop2Score.value = data.wsTop2Score;

  wsBottom1.value = data.wsBottom1;
  wsBottom1Score.value = data.wsBottom1Score;
  wsBottom2.value = data.wsBottom2;
  wsBottom2Score.value = data.wsBottom2Score;

  wFinals1.value = data.wFinals1;
  wFinals1Score.value = data.wFinals1Score;
  wFinals2.value = data.wFinals2;
  wFinals2Score.value = data.wFinals2Score;

  gFinals1.value = data.gFinals1;
  gFinals1Score.value = data.gFinals1Score;
  gFinals2.value = data.gFinals2;
  gFinals2Score.value = data.gFinals2Score;

  leTop1.value = data.leTop1;
  leTop1Score.value = data.leTop1Score;
  leTop2.value = data.leTop2;
  leTop2Score.value = data.leTop2Score;

  leBottom1.value = data.leBottom1;
  leBottom1Score.value = data.leBottom1Score;
  leBottom2.value = data.leBottom2;
  leBottom2Score.value = data.leBottom2Score;

  lqTop1.value = data.lqTop1;
  lqTop1Score.value = data.lqTop1Score;
  lqTop2.value = data.lqTop2;
  lqTop2Score.value = data.lqTop2Score;

  lqBottom1.value = data.lqBottom1;
  lqBottom1Score.value = data.lqBottom1Score;
  lqBottom2.value = data.lqBottom2;
  lqBottom2Score.value = data.lqBottom2Score;

  lSemis1.value = data.lSemis1;
  lSemis1Score.value = data.lSemis1Score;
  lSemis2.value = data.lSemis2;
  lSemis2Score.value = data.lSemis2Score;

  lFinals1.value = data.lFinals1;
  lFinals1Score.value = data.lFinals1Score;
  lFinals2.value = data.lFinals2;
  lFinals2Score.value = data.lFinals2Score;

  setID = data.setID;
  p1ID = data.p1ID;
  p2ID = data.p2ID;

  let acrawdata = fs.readFileSync(savePath + '\\' + 'autocomplete.json');
  let acdata = JSON.parse(acrawdata);

  let players = acdata.players;
  let teams = acdata.teams;
  let rounds = acdata.rounds;

  formatPlayersArray(players);
  formatTeamsArray(teams);
  formatRoundsArray(rounds);
  populateCharacters(game.value);
});

function populateCharacters(game) {
  // Clearing out old game characters
  removeOptions(p1Char);
  removeOptions(p2Char);

	switch (game) {
    case '2XKO':
      chars =[
        'Darius', 'Ekko', 'Ahri', 'Yasuo', 'Illaoi', 'Braum', 'Jinx', 'Katarina'
      ];
      break;
    case 'BBCF':
      chars = [
        'Ragna the Bloodedge', 'Jin Kisaragi', 'Noel Vermillion', 'Rachel Alucard', 'Taokaka', 'Iron Tager', 'Litchi Faye Ling', 'Arakune',
        'Bang Shishigami', 'Carl Clover', 'Hakumen', 'Nu-13', 'Tsubaki Yayoi', 'Hazama', 'Mu-12', 'Makoto Nanaya', 'Valkenhayn R. Hellsing',
        'Platinum the Trinity', 'Relius Clover', 'Izayoi', 'Amane Nishiki', 'Bullet', 'Azrael', 'Kagura Mutsuki', 'Kokonoe', 'Yūki Terumi',
        'Celica A. Mercury', 'Lambda-11', 'Hibiki Kohaku', 'Konoe A. Mercury', 'Naoto Kurogane', 'Hades Izanami', "Susano'o", 'Es',
        'Mai Natsume', 'Jūbei'
      ];
      break;
    case 'DNF':
      chars = [
        'Berserker', 'Crusader', 'Dragon Knight', 'Enchantress', 'Ghostblade', 'Grappler', 'Hitman', 'Inquisitor', 'Kunoichi', 'Launcher', 'Lost Warrior',
        'Ranger', 'Spectre', 'Striker', 'Swift Master', 'Troubleshooter', 'Vanguard'
      ];
      break;
    case 'BBTAG':
      chars = [
        'Azrael', 'Celica A. Mercury', 'Es', 'Hakumen', 'Hazama', 'Iron Tager', 'Izayoi', 'Jin Kisaragi', 'Jubei', 'Mai Natsume', 'Makoto Nanaya',
        'Naoto Kurogane', 'Nine the Phantom', 'Noel Vermillion', 'Nu-13', 'Platinum the Trinity', 'Rachel Alucard', 'Ragna the Bloodedge', "Susano'o",
        'Aegis', 'Akihiko Sanada', 'Chie Satonaka', 'Elizabeth', 'Kanji Tatsumi', 'Labrys', 'Mitsuru Kirijo', 'Naoto Shirogane', 'Teddie', 'Tohru Adachi',
        'Yousuke Hanamura', 'Yu Narukami', 'Yukiki Amagi', 'Carmine', 'Gordeau', 'Hilda', 'Hyde', 'Linne', 'Merkava', 'Mika', 'Orie', 'Seth', 'Vatista',
        'Waldstein', 'Yuzuriha', 'Blake Belladonna', 'Neo Politan', 'Ruby Rose', 'Weiss Schnee', 'Yang Xia Long', 'Heart Aino', 'Yumi', 'Akatsuki', 'Blitztank'
      ];
      break;
    case 'DBFZ':
      chars = [
        'Android 16', 'Android 17', 'Android 18', 'Android 21', 'Lab Coat Android 21', 'Bardock', 'Beerus', 'Broly', 'DBS Broly', 'Captain Ginyu', 'Cell', 'Cooler',
        'Frieza', 'SSB Gogeta', 'SS4 Gogeta', 'Teen Gohan', 'Adult Gohan', 'Goku', 'SS Goku', 'SSB Goku', 'UI Goku', 'GT Goku', 'Goku Black', 'Gotenks', 'Hit', 'Janemba',
        'Jiren', 'Kefla', 'Kid Buu', 'Krillin', 'Majin Buu', 'Master Roshi', 'Nappa', 'Piccolo', 'Super Baby 2', 'Tien', 'Trunks', 'Vegeta', 'SS Vegeta', 'SSB Vegeta',
        'SSB Vegito', 'Videl', 'Yamcha', 'Fused Zamasu'
      ];
      break;
    case 'FFCOTW':
      chars = [
        'Rock Howard', 'Terry Bogard', 'Preecha', 'Hotaru Futaba', 'Tizoc', 'Marco Rodrigues', 'B. Jenet', 'Vox Reaper', 'Kevin Rian', 'Billy Kane', 'Mai Shiranui'
      ];
      break;
    case 'KOFXV':
      chars = [
        "Shun'ei", 'Meitenkun', 'Benimaru Nikaido', 'Ash Crimson', 'Elisabeth', 'Kukri', 'Kyo Kusanagi', 'Iori Yagami', 'Chizuru Kagura', "K'", 'Maxima',
        'Whip', 'Isla', 'Heidern', 'Dolores', 'Terry Bogard', 'Andy Bogard', 'Joe Higashi', 'Ryo Sakazaki', 'Robert Garcia', 'King', 'Yashiro Nanakase',
        'Shermie', 'Chris', 'Athena Asamiya', 'Yuri Sakazaki', 'Mai Shiranui', 'Leona Heidern', 'Ralf Jones', 'Clark Still', 'Antonov', 'Ramon', 'King of Dinosaurs',
        'Krohnen', 'Kula Diamond', 'Angel', 'Blue Mary', 'Vanessa', 'Luong', 'Rock Howard', 'B. Jenet', 'Gato', 'Geese Howard', 'Billy Kane', 'Ryuji Yamazaki', 'Orochi Yashiro',
        'Orochi Shermie', 'Orochi Chris', 'Haohmaru', 'Nakoruru', 'Darli Dagger', 'Shingo Yabuki', 'Kim Kaphwan', 'Sylvie Paula Paula', 'Goenitz', 'Najd', 'Duolon', 'Hinakno Shijo', 'Omega Rugal'
      ];
      break;
    case 'MVCI':
      chars = [
        'Arthur', 'Chris', 'Chun-Li', 'Dante', 'Firebrand', 'Frank West', 'Haggar', 'Jedah', 'Monster Hunter', 'Morrigan', 'Nemesis', 'Ryu', 'Sigma', 'Spencer', 'Strider Hiryu',
        'X', 'Zero', 'Black Panther', 'Black Widow', 'Captain America', 'Captain Marvel', 'Doctor Strange', 'Dormammu', 'Gamora', 'Ghost Rider', 'Hawkeye', 'Hulk', 'Iron Man', 'Nova',
        'Rocket Raccoon', 'Spider-Man', 'Thanos', 'Thor', 'Ultron', 'Venom', 'Winter Soldier'
      ];
      break;
    case 'UMVC3':
      chars = [
        'Dr. Doom', 'Dante', 'Vergil', 'Wesker', 'Wolverine', 'Akuma', 'Nova', 'Sentinel', 'Zero', 'Spencer', 'Magneto', 'Deadpool', 'Strider', 'Morrigan', 'Frank West', 'Taskmaster',
        'Captain America', 'Dormammu', 'Ryu', 'Hulk', 'Amaterasu', 'Hawkeye', 'X-23', 'Phoenix Wright', 'Trish', 'Haggar', 'Chris Redfield', 'Iron Man', 'Super-Skrull', 'Spider-Man',
        'Dr. Strange', 'Felicia', 'Nemesis', 'C. Viper', 'Chun-Li', 'Ghost Rider', 'Iron Fist', 'Phoenix', 'Tron Bonne', 'Rocket Raccoon', 'Firebrand', 'Hsien-Ko', 'Storm', 'Shuma-Gorath',
        'Arthur', 'Viewtiful Joe', 'She-Hulk', 'Jill', 'Thor', 'Modok'
      ];
      break;
    case 'P4AU':
      chars = [
        'Aigis', 'Akihiko Sanada', 'Chie Satonaka', 'Elizabeth', 'Junpei Iori', 'Kanji Tatsumi', 'Ken Amada',  'Labrys', 'Margaret', 'Marie', 'Mitsuru Kirijo', 'Naoto Shirogane', 'Rise Kujikawa', 'Shadow Labrys',
        'SHO Minazuki', 'Sho MINAZUKI', 'Teddie', 'Tohru Adachi', 'Yosuke Hanamura', 'Yu Narukami', 'Yukari Takeba', 'Yukiko Amagi'
      ];
      break;
    case 'GBVS':
      chars = [
        'Gran', 'Katalina', 'Charlotta', 'Lancelot', 'Ferry', 'Lowain', 'Ladiva', 'Percival', 'Metera', 'Zeta', 'Vaseraga', 'Beelzebub',
        'Narmaya', 'Soriz', 'Djeeta', 'Zooey', 'Belial', 'Cagliostro', 'Yuel', 'Anre', 'Eustace', 'Seox', 'Vira', 'Avatar Belial'
      ];
      break;
    case 'GBVSR':
      chars = [
          'Gran', 'Katalina', 'Charlotta', 'Lancelot', 'Ferry', 'Lowain', 'Ladiva', 'Percival', 'Metera', 'Zeta', 'Vaseraga', 'Beelzebub',
          'Narmaya', 'Soriz', 'Djeeta', 'Zooey', 'Belial', 'Cagliostro', 'Yuel', 'Anre', 'Eustace', 'Seox', 'Vira', 'Avatar Belial', 'Anila',
          'Siegfried', 'Nier', 'Grimnir', 'Lucilius', '2B', 'Vane', 'Beatrix', 'Versusia', 'Vikala', 'Sandalphon'
      ];
      break;
    case 'GGXRD':
      chars = [
        'Answer', 'Axl Low', 'Baiken', 'Bedman', 'Chipp Zanuff', 'Dizzy', 'Elphelt Valentine', 'Faust', 'I-No', "Jack-O'", 'Jam Kuradoberi',
        'Johnny', 'Kum Haehyun', 'Ky Kiske', 'Leo Whitefang', 'May', 'Millia Rage', 'Potemkin', 'Ramlethal Valentine', 'Raven', 'Sin Kiske',
        'Slayer', 'Sol Badguy', 'Venom'
      ];
      break;
    case 'GGST':
      chars = [
        'Anji Mito', 'Axl Low', 'Baiken', 'Chipp Zanuff', 'Faust', 'Giovanna', 'Goldlewis Dickinson', 'Happy Chaos', 'I-No', "Jack-O'",
        'Ky Kiske', 'Leo Whitefang', 'May', 'Millia Rage', 'Nagoriyuki', 'Potemkin', 'Ramlethal Valentine', 'Sol Badguy', 'Testament',
        'Zato-1', 'Sin Kiske', 'Bridget', 'Bedman?', 'Asuka R♯', 'Johnny', ' Elphelt Valentine', 'A.B.A.', 'Slayer', 'Queen Dizzy', 'Venom', 'Unika'
      ];
      break;
    case 'MBAACC':
      chars = [
        'Aoko Aozaki', 'Shiki Tohno', 'Archetype: Earth', 'Shiki Nanaya', 'Kouma Kishima', 'Miyako Arima', 'Ciel', 'Sion Eltnam Atlasia', 'Riesbyfe Stridberg', 'Sion TATARI',
        'Warachia', 'Roa', 'Maids', 'Akiha Tohno', 'Arcueid Brunestud', 'Powered Ciel', 'Red Arcueid', 'Akiha Vermilion', 'Mech-Hisui', 'Akiha Tohno (Seifuku)',
        'Satsuki Yumizuka', 'Len', 'Shiki Ryougi', 'White Len', 'Nero Chaos', 'Neco-Arc Chaos', 'Koha & Mech', 'Hisui', 'Neco-Arc', 'Kohaku', 'Neco & Mech'
      ];
    break;
    case 'MBTL':
      chars = [
        'Shiki Tohno', 'Arcueid Brunestud', 'Akiha Tohno', 'Ciel', 'Hisui', 'Kohaku', 'Maids', 'Miyako Arima', 'Kouma Kishima', 'Noel',
        'Michael Roa Valdamjong', 'Vlov Arkhangel', 'Red Arcueid', 'Saber', 'Dead Apostle Noel', 'Aoko Aozaki', 'Mario Gallo Bestino', 'Powered Ciel',
        'Neco-Arc', 'Mash Kyrielight', 'Edmond Dantes', 'Ushiwakamaru'
      ];
      break;
    case 'SFVCE':
      chars = [
        'Ryu', 'Chun-Li', 'Nash', 'M. Bison', 'Cammy', 'Birdie', 'Ken', 'Necalli', 'Vega', 'R.Mika', 'Rashid', 'Karin', 'Zangief', 'Laura', 'Dhalism', 'F.A.N.G',
        'Alex', 'Guile', 'Ibuki', 'Balrog', 'Juri', 'Urien', 'Akuma', 'Kolin', 'Ed', 'Abigail', 'Menat', 'Zeku', 'Sakura', 'Blanka', 'Falke', 'Cody', 'G', 'Sagat',
        'Kage', 'E. Honda', 'Lucia', 'Poison', 'Gill', 'Seth', 'Dan', 'Rose', 'Oro', 'Akira', 'Luke'
      ];
      break;
    case 'SF6':
      chars = [
         'Ryu', 'Luke', 'Jamie', 'Chun-Li', 'Guile', 'Kimberly', 'Juri', 'Ken', 'Blanka', 'Dhalism', 'E. Honda', 'Dee Jay', 'Manon', 'Marisa', 'JP', 'Terry', 'M.Bison', 'Akuma',
         'Ed', 'A.K.I', 'Rashid', 'Cammy', 'Lily', 'Zangief'
      ];
      break;
    case 'TEKKEN7':
      chars = [
        'Asuka', 'Akuma', 'King', 'Jin', 'Lili', 'Kazuya', 'Kazumi', 'Eliza', 'Josie', 'Dragunov', 'Lucky Chloe', 'Geese Howard', 'Katarina', 'Hwoarang', 'Bryan', 'Steve',
        'Miguel', 'Feng', 'Alisa', 'Lars', 'Nina', 'Xiaoyu', 'Lee', 'Paul', 'Noctis', 'Law', 'Heihachi', 'Armor King', 'Leo', 'Devil Jin', 'Yoshimitsu', 'Claudio', 'Julia',
        'Shaheen', 'Master Raven', 'Anna', 'Negan', 'Kuma', 'Bob', 'Gigas', 'Jack-7', 'Eddy', 'Lei', 'Kunimitsu', 'Leroy', 'Marduk', 'Fahkumram', 'Zafina', 'Lidia',
        'Panda', 'Ganryu'
      ];
      break;
    case 'TEKKEN8':
      chars = [
        'Kazuya', 'Jin', 'King', 'Jun', 'Paul', 'Law', 'Jack-8', 'Lars', 'Xiaoyu', 'Nina', 'Leroy', 'Asuka', 'Lili', 'Bryan', 'Hwoarang', 'Claudio', 'Azucena', 'Raven', 'Leo',
        'Steve', 'Kuma', 'Yoshimitsu', 'Shaheen', 'Dragunov', 'Feng', 'Panda', 'Lee', 'Alisa', 'Zafina', 'Devil Jin', 'Victor', 'Reina', 'Eddy', 'Lidia'
      ];
      break;
    case 'UNICLR':
      chars = [
        'Hyde', 'Linne', 'Waldstein', 'Carmine', 'Orie', 'Gordeau', 'Merkava', 'Vatista', 'Seth', 'Yuzuriha', 'Hilda', 'Chaos', 'Nanase',
        'Byakuya', 'Phonon', 'Mika', 'Wagner', 'Enkidu', 'Londrekia', 'Eltnum', 'Akatsuki'
      ];
      break;
    case 'UNISC':
      chars = [
          'Hyde', 'Linne', 'Waldstein', 'Carmine', 'Orie', 'Gordeau', 'Merkava', 'Vatista', 'Seth', 'Yuzuriha', 'Hilda', 'Chaos', 'Nanase',
          'Byakuya', 'Phonon', 'Mika', 'Wagner', 'Enkidu', 'Londrekia', 'Eltnum', 'Akatsuki', 'Tsurugi', 'Kagyua', 'Kuon', 'Uzuki', 'Ogre', 'Izumi'
      ];
      break;
    case 'USF4':
      chars = [
        'Abel', 'Adon', 'Akuma', 'Balrog', 'Blanka', 'C. Viper', 'Cammy', 'Chun-Li', 'Cody', 'Dan', 'Decapre', 'Dee Jay', 'Dhalsim', 'Dudley', 'E. Honda',
        'El Fuerte', 'Elena', 'Evil Ryu', 'Fei Long', 'Gen', 'Gouken', 'Guile', 'Guy', 'Hakan', 'Hugo', 'Ibuki', 'Juri', 'Ken', 'M. Bison', 'Makoto', 'Oni',
        'Poison', 'Rolento', 'Rose', 'Rufus', 'Ryu', 'Sagat', 'Sakura', 'Seth', 'T. Hawk', 'Vega', 'Yang', 'Yun', 'Zangief'
      ];
      break;
    default:
    // Defaulting to BBCF
    chars = [
      'Ragna the Bloodedge', 'Jin Kisaragi', 'Noel Vermillion', 'Rachel Alucard', 'Taokaka', 'Iron Tager', 'Litchi Faye Ling', 'Arakune',
      'Bang Shishigami', 'Carl Clover', 'Hakumen', 'Nu-13', 'Tsubaki Yayoi', 'Hazama', 'Mu-12', 'Makoto Nanaya', 'Valkenhayn R. Hellsing',
      'Platinum the Trinity', 'Relius Clover', 'Izayoi', 'Amane Nishiki', 'Bullet', 'Azrael', 'Kagura Mutsuki', 'Kokonoe', 'Yūki Terumi',
      'Celica A. Mercury', 'Lambda-11', 'Hibiki Kohaku', 'Konoe A. Mercury', 'Naoto Kurogane', 'Hades Izanami', "Susano'o", 'Es',
      'Mai Natsume', 'Jūbei'
    ];
  }

  // Adding the charaters to the UI
  var sortedChars = chars.sort();
  for (var i = 0; i < sortedChars.length; i++){
    var character = sortedChars[i];
    var element = document.createElement("option");
    element.innerText = character;
    p1Char.append(element);
    p1Char.loadOptions();
  }

  for (var i = 0; i < sortedChars.length; i++){
    var character = sortedChars[i];
    var element = document.createElement("option");
    element.innerText = character;
    p2Char.append(element);
    p2Char.loadOptions();
  }
}

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
  /* robotjs will not run corrrectly outside of the index.js file. In order to trigger
  systemwide button presses via  button click, we must use ipc to send a notification
  from render.js to index.js where we then run robotjs to trigger the button press. */
  ipcRenderer.send('keypress', key);
}
