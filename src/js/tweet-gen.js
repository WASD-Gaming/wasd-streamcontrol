module.exports = function generateTweet(button, matcherino, bracket, com1, com2) {

		if (matcherino === '' || bracket === '') {
			alert("Please make sure you've entered both the Matcherino and Bracket URLs.");
			return;
		}

		var pathArray = bracket.split( '/' );
		var tournament_slug = pathArray[3];

		pathArray = bracket.split( '.' );
		var organization = pathArray[0].replace('https://','');
		var service = pathArray[1];

		var bodyDictionary = {
			'service': service,
			'organization': organization,
			'tournament_slug': tournament_slug,
			'button': button,
			'matcherino': matcherino,
			'bracket': bracket,
			'com1': document.getElementById('commentator1').value,
			'com2': document.getElementById('commentator2').value,
		};
		console.log(bodyDictionary);
		// const response  = await fetch('https://wasd-tweet-gen.herokuapp.com/tweet-gen', {
		const response  = await fetch('http://localhost:5001/tweet-gen', {
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
			document.getElementById('tweet-message').value = data[0]['message'];
			console.log(data);
			return data[0]['message'];
		}
	};
