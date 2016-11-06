var renderer = {};  // put all render functions in here

// Improve Stravas datetime formatting:
renderer.formatDate = function(utcDate) {
	var d = new Date(utcDate);
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	return d.getDate() + ' ' + months[d.getMonth()];
};

renderer.formatTime = function(utcDate) {
	var d = new Date(utcDate);
	var hours = d.getHours(),
		minutes = d.getMinutes();
	// Zero-fill:
	if (hours < 10) { hours = '0' + hours; }
	if (minutes < 10) { minutes = '0' + minutes; }
	return hours + ':' + minutes;
};

// Improve Stravas distance formatting (m -> km):
renderer.formatKm = function(metres) {
	return (metres / 1000).toFixed(1) + 'km';	// 1 decimal place
};

// Improve Stravas elevation formatting:
renderer.formatElev = function(metres) {
	return metres.toFixed(0) + 'm';
};

// Improve Stravas speed formatting (m/s -> km/h):
renderer.formatSpeed = function(ms) {
	return (ms * 3.6).toFixed(1) + 'km/h';
};


// Return html of fetched activities as list items:
renderer.printListItems = function(rides) {
	var html = '';
    for (var i = 0; i < rides.length; i++) {
        var ride = rides[i];
		// It must have a polyline to be included:
		if (ride.map.summary_polyline) {
			html += `<li ${renderer.printRideDataAttributes(ride, ride.athlete)}>
			         ${renderer.printRideDetails(ride, ride.athlete)}
			         </li>`;
		}
    }
	return html;
};

// Return the inline data-attributes for the list item html:
renderer.printRideDataAttributes = function(ride, ath) {
	var html = `data-rideid="${ride.id}"
            	data-date="${renderer.formatDate(ride.start_date_local)}"
            	data-time="${renderer.formatTime(ride.start_date_local)}"
            	data-title="${ride.name}"
            	data-type="${ride.type}"
            	data-dist="${renderer.formatKm(ride.distance)}"
            	data-elev="${renderer.formatElev(ride.total_elevation_gain)}"
				data-speed="${renderer.formatSpeed(ride.average_speed)}"
            	data-athlete="${ath.firstname} ${ath.lastname}"
				data-athleteid="${ath.id}"
            	data-avatar="${ath.profile}"
            	data-summary="${ride.map.summary_polyline}"
				data-kudos-count=${ride.kudos_count}
				data-has-kudoed=${ride.has_kudoed}`;
	return html;
};

// Return html with ride data and athlete data:
renderer.printRideDetails = function(ride, ath) {
	var html = `<h6>
					<span class="icon ${ride.type.toLowerCase()}"></span>
					${ride.name}
					${renderer.makeRideLink(ride.id)}
				</h6>
            	<span>${renderer.formatDate(ride.start_date_local)} ${renderer.formatTime(ride.start_date_local)}</span>
            	<div>
					${renderer.printAthlete(ath)}
				</div>
            	<span class="stats">&roarr;&nbsp;${renderer.formatKm(ride.distance)}</span>
            	<span class="stats">&lrtri;&nbsp;${renderer.formatElev(ride.total_elevation_gain)}</span>
				<span class="stats">&raquo;&nbsp;${renderer.formatSpeed(ride.average_speed)}</span>
				<span class="icon kudos ${ride.has_kudoed ? 'given' : ''}">${ride.kudos_count}</span>
				`;
    return html;
};

// Return html with some athlete data:
renderer.printAthlete = function(ath) {
	var html = `<img class="avatar" src="${ath.profile}">
            	<span class="athlete">${renderer.makeAthleteLink(ath.id, ath.firstname+' '+ath.lastname)}</span>
            	<span class="city">(${ath.city})</span>`;
	return html;
};

// Return html with the clubs dropdown options:
renderer.printClubs = function(clubs) {
	var html = '';
    for (var i = 0; i < clubs.length; i++) {
        var club = clubs[i];
		html += `<option data-cid="${club.id}">${club.name}</option>`;
	}
	return html;
};

// Make a link to a Strava athlete:
renderer.makeAthleteLink = function(id, text) {
	return `<a target="_blank" href="http://www.strava.com/athletes/${id}">${text}</a>`;
};
// Make a link to a Strava ride:
renderer.makeRideLink = function(id) {
	return `<a target="_blank" class="stravalink" href="http://www.strava.com/activities/${id}"></a>`;
};
