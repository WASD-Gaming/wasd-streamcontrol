const { ipcRenderer } = require('electron');

let cachedApiUrl = null;

function initTwitterModule(envVars) {
  cachedApiUrl = envVars.nodeEnv === 'production' ? envVars.production : envVars.development;

  async function fetchApiUrl() {
    return cachedApiUrl;
  }

  const twitter = {
    // Correcting the syntax by removing '=' and using shorthand method definitions
    async generateTweet(button, matcherino, bracket, com1, com2, game) {
      const apiURL = await fetchApiUrl();
  
      if (matcherino === '' || bracket === '') {
        alert("😔 Something went wrong. Please make sure you've entered both the Matcherino and Bracket URLs.");
      }
  
      var pathArray = bracket.split('.');
      var organization = pathArray[0].replace('https://','');
      var service = pathArray[1];
  
      pathArray = bracket.split('/');
      var tournament_slug;
  
      if(service === 'start') {
        tournament_slug = pathArray[4];
      } else if(service === 'challonge') {
        tournament_slug = pathArray[3];
      }
  
      var bodyDictionary = {
        'service': service,
        'organization': organization,
        'tournament_slug': tournament_slug,
        'button': button,
        'matcherino': matcherino,
        'bracket': bracket,
        'com1': com1,
        'com2': com2,
        'game': game
      };
  
      const response  = await fetch(apiURL, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bodyDictionary),
      });
      var data = await response.json();
  
      if ('error' in data[0]) {
        alert(data[0]['error']);
        return data[0]['error'];
      } else {
        console.log(data);
        return data[0]['message'];
      }
    },
  
    async populateTop8(button, bracket, game) {
      const apiURL = await fetchApiUrl();
  
      if (bracket === '') {
        alert("😔 Something went wrong. Please make sure you've entered a Bracket URLs.");
      }
  
      var pathArray = bracket.split('.');
      var organization = pathArray[0].replace('https://','');
      var service = pathArray[1];
  
      pathArray = bracket.split('/');
      var tournament_slug;
  
      if(service === 'start') {
        tournament_slug = pathArray[4];
      } else if(service==='challonge') {
        tournament_slug = pathArray[3];
      }
  
      var bodyDictionary = {
        'service': service,
        'organization': organization,
        'tournament_slug': tournament_slug,
        'button': button,
        'matcherino': '',
        'bracket': bracket,
        'com1': '',
        'com2': '',
        'game': game
      };
  
      const response  = await fetch(apiURL, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bodyDictionary),
      });
      var data = await response.json();
  
      if ('error' in data[0]) {
        alert(data[0]['error']);
        return data[0]['error'];
      } else {
        console.log(data);
        return data[0]['matches'];
      }
    },
  
    async getStreamQueue(button, bracket) {
      const apiURL = await fetchApiUrl();
  
      if (bracket === '') {
        alert("😔 Something went wrong. Please make sure you've entered a Bracket URLs.");
      }
  
      var pathArray = bracket.split('.');
      var service = pathArray[1];
  
      pathArray = bracket.split('/');
      var tournament_slug;
  
      if(service === 'start') {
        tournament_slug = pathArray[4];
      } else if(service==='challonge') {
        tournament_slug = pathArray[3];
      }
  
      var bodyDictionary = {
        'service': service,
        'tournament_slug': tournament_slug,
        'button': button
      };
  
      const response  = await fetch(apiURL, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bodyDictionary),
      });
      var data = await response.json();
  
      if ('error' in data[0]) {
        alert(data[0]['error']);
        return data[0]['error'];
      } else {
        console.log(data);
        return data;
      }
    },
  
    async sendSetResults(button, bracket, setID, winnerID, p1ID, p1Score, p2ID, p2Score) {
      const apiURL = await fetchApiUrl();
  
      if (bracket === '') {
        alert("😔 Something went wrong. Please make sure you've entered a Bracket URLs.");
      }
  
      var pathArray = bracket.split('.');
      var service = pathArray[1];
  
      var bodyDictionary = {
        'service': service,
        'button': button,
        'setID': setID,
        'winnerID': winnerID,
        'p1ID': p1ID,
        'p1Score': p1Score,
        'p2ID': p2ID,
        'p2Score': p2Score
      };
  
      const response  = await fetch(apiURL, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bodyDictionary),
      });
  
      console.log(`Server responded with ${response.status}: ${response.statusText}`);
    }
  }
  return twitter;
}

module.exports = { initTwitterModule };