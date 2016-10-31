/*global heatmap, renderer, ui, Zepto, $ */

var rides = [];

// Ask php backend to GET the latest rides of a club
function ajaxGetClubRides(cid) {
	console.log('ajaxGetClubRides('+ cid +')');

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
				rides.push(el);
			});

			$(".club-rides").removeClass("active");
			// Make a new list container, tag it, and append to div:
			var el = $("<ul></ul>");
			el.addClass("club-rides active");
			el.data("clubid", cid);
			el.html(renderer.printListItems(data));
			$("#rides").append(el);
			colourTitles();

			// HTML is done, so scrape it to load rides into a new map layer:
			heatmap.populateClubLayer(cid);
		}
	});
}


// Ask php backend to GET the latest rides of athlete's friends
function ajaxGetFriendsRides() {
	console.log('ajaxGetFriendsRides()');

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
				rides.push(el);
			});

			// Process JSON to HTML and insert into the container <ul>:
			$(".friends-rides").html(renderer.printListItems(data));
			colourTitles();

			// HTML is done, so scrape it to load rides into a new map layer:
			heatmap.populateFriendsLayer();
		}
	});
}


// Ask php backend to GET the clubs of the signed-in athlete:
function ajaxGetClubs() {
	console.log('ajaxGetClubs()');

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
//			console.log(data);

			// Get first club id from HTML and fetch its rides:
			var cid = $("select[name=clubs] option:first-child").data("cid");
			ajaxGetClubRides(cid);

			ui.setClub(cid);
		}
	});
}


// Add text colour to the ride titles, generating from the data-rideId:
function colourTitles() {
	$("li > h6").each(function(index, el) {
		var rid = $(el).parent().data("rideid");
		$(el).css("color", ui.selectColour(rid));
	});
}
