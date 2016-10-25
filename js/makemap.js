var heatmap = {

	lineColours: [
		'#f44336',
		'#8bc34a',
		'#fdd835',
		'#039be5',
		'#1a237e',
		'#e65100',
		'#aa00ff',
		'#f06292',
		'#5d4037',
		'#18ffff'
	],
	
	map: null,
	
	infowindow: null,
	
	init: function() {
		console.log(google);
		// Set up map:
		this.map = new google.maps.Map(document.getElementById('map'), {
			center: new google.maps.LatLng(51.400, -2.600),
			zoom: 9,
			disableDefaultUI: true,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		});
		// Behaviours:
		google.maps.event.addListener(this.map, 'zoom_changed', function(e) {
			destroyTooltips();			
		});
	},
	
	addPolyLine: function(pLine, options) {
		var rideCoords = google.maps.geometry.encoding.decodePath(pLine);
		var ridePath = new google.maps.Polyline({
			path: rideCoords,
			geodesic: true,
			strokeColor: this.selectColor(options.rideId),
			strokeOpacity: 0.6,
			strokeWeight: 4
		});
		// Embed Strava activity data:
		ridePath.options = options;

		// Apply line to map:
		ridePath.setMap(this.map);

		// Make clickable:
		google.maps.event.addListener(ridePath, 'click', function(e) {
			e.stop();	// Don't bubble up
			heatmap.handlePolyLineClick(e, this);
		});
	},
	
	// Bevaviour for when polyLine is clicked
	handlePolyLineClick: function(e, polyLine) {
		console.log(e, polyLine.options);
		destroyTooltips();
		createTooltip({x: e.wa.pageX, y: e.wa.pageY}, e, polyLine.options);	// first arg is page (x,y); second contains LatLng
	},
	
	selectColor: function(id) {
		return this.lineColours[id % 10];	// 0-9
	},
	
	togglePolyLine: function(id) {
		
	}
};


// Callback of Google Maps API call:
var initMap = function() {
	window.addEventListener('load', function() {
		if (document.getElementById('map') && google.load && google.maps) {
			heatmap.init();
					
			// Render the polyLines we stored in the HTML data-attributes:
			if (heatmap.map) {
				console.log("entering polyLine loop");				
				var rides = document.getElementsByTagName('li');
				for (var i = 0; i < rides.length; i++) {
					var ride = rides[i];
					var options = {
						'rideId': ride.getAttribute('data-rideId'),
						'title': ride.getAttribute('data-title'),
						'date': ride.getAttribute('data-date'),
						'dist': ride.getAttribute('data-dist'),
						'elev': ride.getAttribute('data-elev'),
						'athlete': ride.getAttribute('data-athlete'),
						'avatar': ride.getAttribute('data-avatar')
					};
//					console.log(ride);
					heatmap.addPolyLine(ride.getAttribute('data-summary'), options);
				}
			}
		}
	}, false);
};
