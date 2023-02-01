module.exports.generateTweet = async function (button, matcherino, bracket, com1, com2) {

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
		} else if(service==='challonge') {
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
		};
		// console.log(bodyDictionary);
		const response  = await fetch('https://wasd-tweet-gen.herokuapp.com/tweet-gen', {
		// const response  = await fetch('http://localhost:5001/tweet-gen', {
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

	module.exports.populateTop8 = async function (button, bracket) {

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
			};
			
			const response  = await fetch('https://wasd-tweet-gen.herokuapp.com/tweet-gen', {
			// const response  = await fetch('http://localhost:5001/tweet-gen', {
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
