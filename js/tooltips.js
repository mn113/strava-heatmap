function createTooltip(origin, content) {	// {x:x, y:y}, {rideId:, title:, date:, dist:, elev: athlete:, avatar:}

	console.log("Creating TT:", content.rideId);
	
	var el = document.createElement('div');
	el.classList.add('tooltip');
	
	// Activity name
	// Date
	// Distance
	// Athlete name(s)
	// Athlete avatar(s)		
	el.innerHTML = `
		<h6>${content.title}</h6>
		<span class='date'>${content.date}</span>
		<span class='dist'>${content.dist}</span>
		<span class='elev'>${content.elev}</span>
		<span class='athlete'>${content.athlete}</span>
		<img class='avatar' src='${content.avatar}'>
	`;

	// Insert:
	$('body').append(el);

	// Position tooltip triangle point on click:
	el.style.left = origin.x - ($(el).width() / 2) + 'px';
	el.style.top = origin.y - $(el).height() - 10 + 'px';	
}

function destroyTooltips() {
	var divs = document.getElementsByClassName('tooltip');
	[].forEach.call(divs, function(item) {
		item.parentNode.removeChild(item);
	});	
}

// Test:
/*document.getElementById('map').addEventListener('click', function(e) {
	destroyTooltips();
	createTooltip({x: e.pageX, y: e.pageY}, {
		'title': 'My bike ride',
		'date': '2016-10-25',
		'dist': '71.5km',
		'athlete': 'Martin N',
		'avatar': 'https://dgalywyr863hv.cloudfront.net/pictures/athletes/586419/3809466/2/medium.jpg'
	});
});*/

// Zepto version: