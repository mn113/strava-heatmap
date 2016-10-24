// IIFE:
var heatmap = function(google) {

	var map,
		bristol = new google.maps.LatLng(51.400, -2.600),
	
	initMap = function() {
		// Map:
		this.map = new google.maps.Map(document.getElementById('map'), {
			center: this.bristol,
			zoom: 7
		});
		
		// Polyline:
		this.addPolyLine(myLine);
	},
	
	
	addPolyLine = function(pLine, rideId) {
		var rideCoords = google.maps.geometry.encoding.decodePath(pLine);
		var ridePath = new google.maps.Polyline({
			path: rideCoords,
			geodesic: true,
			strokeColor: '#FF0000',
			strokeOpacity: 0.5,
			strokeWeight: 4
		});
		ridePath.setMap(map);	// not decoupled
	},
	
	
	generateColor = function(id) {
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
	};

	// Reveal module:	
	return {
		initMap: initMap,
		addPolyLine: addPolyLine,
		map: map
	}
	
}(google);


console.log(heatmap.generateColor(345123));
console.log(heatmap.generateColor(345120));
console.log(heatmap.generateColor(345113));
console.log(heatmap.generateColor(342923));
console.log(heatmap.generateColor(345888));
