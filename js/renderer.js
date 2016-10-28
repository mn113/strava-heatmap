var renderer = {};  // put all render functions in here

// Improve Stravas datetime formatting:
function formatDate(utcDate) {
	var d = new Date(utcDate);
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	return d.getDate() + ' ' + months[d.getMonth()];
}
function formatTime(utcDate) {
	var d = new Date(utcDate);
	return d.getHours() + ':' + d.getMinutes();
}

// Improve Stravas distance formatting:
function formatKm(metres) {
	return '&roarr;&nbsp;' + (metres / 1000).toFixed(1) + 'km';	// 1 decimal place
}


// Improve Stravas elevation formatting:
function formatElev(metres) {
	return '&lrtri;&nbsp;' + metres.toFixed(0) + 'm';
}


// Return html of fetched activities as list items:
function printListItems(rides) {
	var html = '';
    for (var i = 0; i < rides.length; i++) {
        var ride = rides[i];
        html += `<li ${printRideDataAttributes(ride, ride.athlete)}>
		         ${printRideDetails(ride, ride.athlete)}
		         </li>`;
    }
	return html;
}


// Return the inline data-attributes for the list item html:
function printRideDataAttributes(ride, ath) {
	var html = `data-rideId="${ride.id}"
            	data-date="${formatDate(ride.start_date_local)}"
            	data-time="${formatTime(ride.start_date_local)}"
            	data-title="${ride.name}"
            	data-type="${ride.type}"
            	data-dist="${formatKm(ride.distance)}"
            	data-elev="${formatElev(ride.total_elevation_gain)}"
            	data-athlete="${ath.firstname} ${ath.lastname}"
            	data-avatar="${ath.profile}"
            	data-summary="${ride.map.summary_polyline}"`;
	return html;
}


// Return html with ride data and athlete data:
function printRideDetails(ride, ath) {
	var html = `<h6><span class="icon ${ride.type.toLowerCase()}"></span>${ride.name}</h6>
            	<span>${formatDate(ride.start_date_local)} ${formatTime(ride.start_date_local)}</span>
            	<div>${printAthlete(ath)}</div>
            	<span>${formatKm(ride.distance)}</span>
            	<span>${formatElev(ride.total_elevation_gain)}</span>`;
    return html;
}


// Return html with some athlete data:
function printAthlete(ath) {
	var html = `<img class="avatar" src="${ath.profile}"
            	<span class="athlete">${ath.firstname} ${ath.lastname}</span>
            	<span class="city">(${ath.city})</span>`;
	return html;
}


// Return html with the clubs dropdown options:
function printClubs(clubs) {
	var html = '';
    for (var i = 0; i < clubs.length; i++) {
        var club = clubs[i];
		html += `<option data-cid="${club.id}">${club.name}</option>`;
	}
	return html;
}
