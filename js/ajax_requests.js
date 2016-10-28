// Ask php backend to GET the latest rides of a club
function ajaxGetClubRides(cid) {
	
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
			$(".club_rides").removeClass("active");
			// Make a new list container, tag it, and append to div:
			var el = $("<ul></ul>").addClass("club_rides active").data("clubid", id).html(data);
			$("#rides").append(el);
			console.log(data);
		}
	});
}


// Ask php backend to GET the clubs of the signed-in athlete:
function ajaxGetClubs() {

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
			console.log(data);
			// Append to html:
			$('select[name="clubs-selector"]').html(data);
			return data;
		}
	});	
}
