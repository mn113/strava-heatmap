var renderer = {};  // put all render functions in here

// Improve Stravas datetime formatting:
renderer.formatDate = function(utcDate) {
	var d = new Date(utcDate);
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	return d.getDate() + ' ' + months[d.getMonth()];
};

renderer.formatTime = function(utcDate) {
	var d = new Date(utcDate);
	return d.getHours() + ':' + d.getMinutes();
};

// Improve Stravas distance formatting:
renderer.formatKm = function(metres) {
	return '&roarr;&nbsp;' + (metres / 1000).toFixed(1) + 'km';	// 1 decimal place
};

// Improve Stravas elevation formatting:
renderer.formatElev = function(metres) {
	return '&lrtri;&nbsp;' + metres.toFixed(0) + 'm';
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
	var html = `data-rideId="${ride.id}"
            	data-date="${renderer.formatDate(ride.start_date_local)}"
            	data-time="${renderer.formatTime(ride.start_date_local)}"
            	data-title="${ride.name}"
            	data-type="${ride.type}"
            	data-dist="${renderer.formatKm(ride.distance)}"
            	data-elev="${renderer.formatElev(ride.total_elevation_gain)}"
            	data-athlete="${ath.firstname} ${ath.lastname}"
            	data-avatar="${ath.profile}"
            	data-summary="${ride.map.summary_polyline}"`;
	return html;
};

// Return html with ride data and athlete data:
renderer.printRideDetails = function(ride, ath) {
	var html = `<h6><span class="icon ${ride.type.toLowerCase()}"></span>${ride.name}</h6>
            	<span>${renderer.formatDate(ride.start_date_local)} ${renderer.formatTime(ride.start_date_local)}</span>
            	<div>${renderer.printAthlete(ath)}</div>
            	<span>${renderer.formatKm(ride.distance)}</span>
            	<span>${renderer.formatElev(ride.total_elevation_gain)}</span>`;
    return html;
};

// Return html with some athlete data:
renderer.printAthlete = function(ath) {
	var html = `<img class="avatar" src="${ath.profile}"
            	<span class="athlete">${ath.firstname} ${ath.lastname}</span>
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
