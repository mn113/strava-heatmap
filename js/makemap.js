var heatmap = {

	map: null,
	
	init: function() {
		console.log("called heatmap.init()");
		console.log(google);
		// Set up map:
		this.map = new google.maps.Map(document.getElementById('map'), {
			center: new google.maps.LatLng(51.400, -2.600),
			zoom: 9,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		});
	},
	
	addPolyLine: function(pLine, rideId) {
		var rideCoords = google.maps.geometry.encoding.decodePath(pLine);
		var ridePath = new google.maps.Polyline({
			path: rideCoords,
			geodesic: true,
			rideId: rideId,
			strokeColor: this.generateColor(rideId),
			strokeOpacity: 0.5,
			strokeWeight: 4
		});
		// Apply to map:
		ridePath.setMap(this.map);
		// Make clickable:
		google.maps.event.addListener(ridePath, 'click', function() {
			alert(ridePath.rideId);
		});
	},	
	
	generateColor: function(id) {
		var red = id % 3,					// units as 0,1,2
			blue = Math.floor(id/10) % 3,	// tens
			green = Math.floor(id/100) % 3;	// hundreds
			
		var code = [red, green, blue].map(function(x) {
			var dec = Math.round(x * 127) + 1;	// 1, 128, 255
			var hex = dec.toString(16);			// 1, 80, ff
			// Zero-padding:
			if (hex.length === 1) hex = '0' + hex;
			return hex;
		});
			
		return '#' + code[0] + code[1] + code[2];
	}
};


// Filled in later by PHP:
//var polyLines = [];


// Callback of Google Maps API call:
var initMap = function() {
	window.addEventListener('load', function() {
		if (document.getElementById('map') && google.load) {
			heatmap.init();

			// Render the polyLines we stored in the HTML data-attributes:
			if (heatmap.map) {
				console.log("entering polyLine loop");				
				var rides = document.getElementsByTagName('p');
				for (var i = 0; i < rides.length; i++) {
					var ride = rides[i];
					console.log(ride);
					heatmap.addPolyLine(ride.getAttribute('data-summary'), ride.getAttribute('data-rideId'));
				}
			}
		}
	}, false);
};
