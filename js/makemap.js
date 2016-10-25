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
		google.maps.event.addListener(this.map, 'zoom_changed', function(e) {
			destroyTooltips();			
		});
	},
	
	addPolyLine: function(pLine, options) {
		var rideCoords = google.maps.geometry.encoding.decodePath(pLine);
		var ridePath = new google.maps.Polyline({
			path: rideCoords,
			geodesic: true,
			strokeColor: this.generateColor(options.rideId),
			strokeOpacity: 0.6,
			strokeWeight: 4
		});
		ridePath.options = options;	// will adding options to Polyline object like this work/

		// Apply to map:
		ridePath.setMap(this.map);

		// Make clickable:
		google.maps.event.addListener(ridePath, 'click', function(e) {
			destroyTooltips();
			console.log(e);
			createTooltip({x: e.pageX, y: e.pageY});
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


// Callback of Google Maps API call:
var initMap = function() {
	window.addEventListener('load', function() {
		if (document.getElementById('map') && google.load && google.maps) {
			heatmap.init();
			
			// Set up data-holding polyLine type:
/*			heatmap.customPolyline = google.maps.Polyline.extend({
			    options: {
			        // default values, you can override these when constructing a new customPolyline
			        rideId: '',
					title: 'unknown ride',
					date: 'today',
					dist: '',
					athlete: '',
					avatar: ''
			    }
			});
*/		
			// Render the polyLines we stored in the HTML data-attributes:
			if (heatmap.map) {
				console.log("entering polyLine loop");				
				var rides = document.getElementsByTagName('p');
				for (var i = 0; i < rides.length; i++) {
					var ride = rides[i];
//					console.log(ride);
					heatmap.addPolyLine(ride.getAttribute('data-summary'), ride.getAttribute('data-rideId'));
				}
			}
		}
	}, false);
};
