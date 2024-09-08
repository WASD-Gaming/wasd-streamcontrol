require('dotenv').config();

module.exports.generateTweet = async function (button, matcherino, bracket, com1, com2, game) {

	if (matcherino === '' || bracket === '') {
		alert("😔 Something went wrong. Please make sure you've entered both the Matcherino and Bracket URLs.");
	}

	var pathArray = bracket.split( '.' );
	var organization = pathArray[0].replace('https://','');
	var service = pathArray[1];

	pathArray = bracket.split( '/' );
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

	console.log(process.env.PRODUCTION_API_URL);
	const response  = await fetch('https://sc.wasdgaming.gg/tweet-gen', {
	// const response  = await fetch(process.env.PRODUCTION_API_URL, {
	// const response  = await fetch(process.env.DEVELOPMENT_API_URL, {
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
};

module.exports.populateTop8 = async function (button, bracket, game) {

	if (bracket === '') {
		alert("😔 Something went wrong. Please make sure you've entered a Bracket URLs.");
	}

	var pathArray = bracket.split( '.' );
	var organization = pathArray[0].replace('https://','');
	var service = pathArray[1];

	pathArray = bracket.split( '/' );
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
			
	// const response  = await fetch(process.env.PRODUCTION_API_URL, {
	const response  = await fetch('https://sc.wasdgaming.gg/tweet-gen', {
	// const response  = await fetch(process.env.DEVELOPMENT_API_URL, {
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
};

module.exports.getStreamQueue = async function (button, bracket) {

	if (bracket === '') {
		alert("😔 Something went wrong. Please make sure you've entered a Bracket URLs.");
	}

	var pathArray = bracket.split( '.' );
	var service = pathArray[1];

	pathArray = bracket.split( '/' );
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
	
	const response  = await fetch('https://sc.wasdgaming.gg/tweet-gen', {		
	// const response  = await fetch(process.env.PRODUCTION_API_URL, {
	// const response  = await fetch(process.env.DEVELOPMENT_API_URL, {
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
};

module.exports.getGameCharacters = async function (button, gameShortCode) {

	var bodyDictionary = {
		'game': gameShortCode,
		'button': button,
		'service': 'start'
	};
	
	// const response  = await fetch('https://sc.wasdgaming.gg/tweet-gen', {		
	// const response  = await fetch(process.env.PRODUCTION_API_URL, {
	const response  = await fetch(process.env.DEVELOPMENT_API_URL, {
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
};

module.exports.sendSetResults = async function (button, bracket, setID, winnerID, p1ID, p1Score, p2ID, p2Score) {

	if (bracket === '') {
		alert("😔 Something went wrong. Please make sure you've entered a Bracket URLs.");
	}

	var pathArray = bracket.split( '.' );
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
	
	const response  = await fetch('https://sc.wasdgaming.gg/tweet-gen', {
	// const response  = await fetch(process.env.PRODUCTION_API_URL, {
	// const response  = await fetch(process.env.DEVELOPMENT_API_URL, {
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
};