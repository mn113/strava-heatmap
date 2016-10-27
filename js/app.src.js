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
	
	paths: {},
	
	init: function() {
		var bristol = 	[51.400, -2.600],
			bath = 		[51.375801, -2.359904],
			bradford = 	[51.345178, -2.252502],
			bbb = [bristol, bath, bradford];
			
		this.map = L.map('map').setView(bristol, 9);
		
		L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}', {
		    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
		    maxZoom: 18,
		    accessToken: 'pk.eyJ1IjoibWVlcmthdG9yIiwiYSI6ImNpdXF4Mm91azAwMGEyb21pcDFmN3J5NXcifQ.pW6SQDz9wpFr619vzHtcAA'
		}).addTo(this.map);
		
		// Add any paths we have stored:
		this.addSessionPaths();

		// Map behaviours:

	},
	
	addPath: function(data) {
		// Convert Strava's Polyline to coords:
		var rideCoords = window.polyline.decode(data.path);

		// Create path:
		var ridePath = L.polyline(rideCoords, {
							color: this.selectColor(data.rideId) || 'red',
							opacity: '0.8'
						});
		ridePath.addTo(heatmap.map);
//		heatmap.map.fitBounds(ridePath.getBounds());	// SOMETIMES INVALID

		// Embed Strava activity data in path:
		ridePath.data = data;

		// Prepare tooltip:
		ridePath.tooltipContent = `
			<h6 id="${data.rideId}">${data.title}</h6>
			<img class='avatar' src='${data.avatar}'>
			<span class='date'>${data.date}&nbsp;${data.time}</span>
			<div class='athlete'>${data.athlete}</div>
			<span>${data.dist}&nbsp;${data.elev}</span>
			<span class="icon ${data.type}">
		`;

		// Make path clickable:
		ridePath.on('click', function(e) {
			// Create new point and open a tooltip there:
			var point = L.latLng(e.latlng);
			heatmap.map.openPopup(this.tooltipContent, point);
		});

		// Register path:
		heatmap.paths[data.rideId] = ridePath;
	},
	
	addSessionPaths: function() {
		
	},
	
	selectColor: function(id) {
		return this.lineColours[id % 10];	// 0-9
	},
	
	togglePath: function(id) {
		
	}
};


// DOM ready:
Zepto(function($) {
	heatmap.init();	

	// Render the polyLines we stored in the HTML data-attributes:
	if (heatmap.map) {
		var rides = document.getElementsByTagName('li');
		for (var i = 0; i < rides.length; i++) {
			var ride = rides[i];
			var data = {
				'rideId': ride.getAttribute('data-rideId'),
				'title': ride.getAttribute('data-title'),
				'date': ride.getAttribute('data-date'),
				'time': ride.getAttribute('data-time'),
				'type': ride.getAttribute('data-type'),
				'dist': ride.getAttribute('data-dist'),
				'elev': ride.getAttribute('data-elev'),
				'athlete': ride.getAttribute('data-athlete'),
				'avatar': ride.getAttribute('data-avatar'),
				'path': ride.getAttribute('data-summary')
			};
//			console.log(data);
			heatmap.addPath(data);
		}
	}

	// Checkbox path toggles:
	$("#rides ul li").children("input[type=checkbox]").on('change', function() {
		var rideId = $(this).parent("li").attr("data-rideId");
//		console.log(rideId, this.checked);
		if (this.checked) {
			heatmap.paths[rideId].addTo(heatmap.map);
		} else {
			heatmap.paths[rideId].remove();
		}
	});

});


