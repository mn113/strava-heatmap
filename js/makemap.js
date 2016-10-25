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
			strokeColor: this.selectColor(options.rideId),
			strokeOpacity: 0.6,
			strokeWeight: 4
		});
		ridePath.options = options;	// will adding options to Polyline object like this work/

		// Apply to map:
		ridePath.setMap(this.map);

		// Make clickable:
		google.maps.event.addListener(ridePath, 'click', function(e) {
			heatmap.handlePolyLineClick(e, this);
		});
	},
	
	handlePolyLineClick: function(e, polyLine) {
		console.log(e, polyLine.options);
		destroyTooltips();
		createTooltip({x: e.wa.pageX, y: e.wa.pageY}, polyLine.options);	
	},
	
	selectColor: function(id) {
		return this.lineColours[id % 10];	// 0-9
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
					console.log(ride);
					heatmap.addPolyLine(ride.getAttribute('data-summary'), options);
				}
			}
		}
	}, false);
};
