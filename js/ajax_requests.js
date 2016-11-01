/*global heatmap, renderer, ui, Zepto, $, L, rides, ajax */

var ajax = {};

// Ask php backend to GET the latest rides of a club
ajax.getClubRides = function (cid) {
	console.log('ajax.getClubRides('+ cid +')');

	$.ajax({
		url: 'apirequests.php',
		// data to be added to query string:
		data: {
			resource: 'club_activities',
			id: cid
		},
		dataType: 'json',
		timeout: 3000,
		success: function(data) {
			// Store data in raw form:
			data.forEach(function(el) {
				rides.all.push(el);
			});

			$(".club-rides").removeClass("active");
			// Make a new list container, tag it, and append to div:
			var el = $("<ul></ul>");
			el.addClass("club-rides active");
			el.data("clubid", cid);
			el.html(renderer.printListItems(data));
			$("#rides").append(el);
			ui.colourTitles();
			// Attach event listener for li clicks:
			ui.attachLiClickListeners();

			// HTML is done, so scrape it to load rides into a new map layer:
			heatmap.populateClubLayer(cid);

			// Filter displayed data:
			heatmap.filterPaths(rides.applyFilter());
			ui.filterHTML(rides.applyFilter());
		}
	});
};


// Ask php backend to GET the latest rides of athlete's friends
ajax.getFriendsRides = function() {
	console.log('ajax.getFriendsRides()');

	$.ajax({
		url: 'apirequests.php',
		// data to be added to query string:
		data: {
			resource: 'friend_activities',
			id: 1
		},
		dataType: 'json',
		timeout: 3000,
		success: function(data) {
			// Store data in raw form:
			data.forEach(function(el) {
				rides.all.push(el);
			});

			// Process JSON to HTML and insert into the container <ul>:
			$(".friends-rides").html(renderer.printListItems(data));
			ui.colourTitles();
			// Attach event listener for li clicks:
			ui.attachLiClickListeners();

			// HTML is done, so scrape it to load rides into a new map layer:
			heatmap.populateFriendsLayer();

			// Filter displayed data:
			heatmap.filterPaths(rides.applyFilter());
			ui.filterHTML(rides.applyFilter());
		}
	});
};


// Ask php backend to GET the clubs of the signed-in athlete:
ajax.getClubs = function() {
	console.log('ajax.getClubs()');

	$.ajax({
		url: 'apirequests.php',
		// data to be added to query string:
		data: {
			resource: 'clubs',
			id: 1
		},
		dataType: 'json',
		timeout: 3000,
		success: function(data) {
			// Store data in raw form:
			ui.clubs = data;

			// Append to html:
			$('select[name="clubs"]').html(renderer.printClubs(data));
			//console.log(data);

			// Get first club id from HTML and fetch its rides:
			var cid = $("select[name=clubs] option:first-child").data("cid");
			ajax.getClubRides(cid);

			ui.setClub(cid);
		}
	});
};


ajax.geoLookup = function(city, country) {
	var url = "https://maps.googleapis.com/maps/api/geocode/json?address=" + city + ',' + country;
	$.getJSON(url, function(data) {
		if (data.status === 'OK') {
//			console.log(data.results[0].geometry.location);
//			return data.results[0].geometry.location;
			heatmap.zoomMap(data.results[0].geometry.location, 9);
		}
	});
};
