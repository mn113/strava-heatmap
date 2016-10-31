/*global heatmap, renderer, ui, Zepto, $, L, rides, ajax */
var heatmap = {

	map: null,
	layerGroups: null,		// friends, club1, club2...
	layerControl: null,
	paths: {},	//?

	init: function() {
		// Define MapBox basemap ('light'):
		var attribution = `
			Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors
			<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>,
			Imagery &copy; <a href="http://mapbox.com">Mapbox</a>`,
			mapboxBaseUrl = 'https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token=',
			access_token = 'pk.eyJ1IjoibWVlcmthdG9yIiwiYSI6ImNpdXF4Mm91azAwMGEyb21pcDFmN3J5NXcifQ.pW6SQDz9wpFr619vzHtcAA';

		var lightBase = L.tileLayer(
			mapboxBaseUrl + access_token, {
			    attribution: attribution,
			    maxZoom: 20,
				id: 'lightBase'
		});

		var bristol = [51.400, -2.600];

		// Initialise map:
		this.map = L.map('map', {
			center: bristol,
			zoom: 9,
			layers: [lightBase]
		});

		this.initLayers();
	},


	initLayers: function() {
		// Set up initial layers:
        this.layerGroups = { "Friends": new L.LayerGroup() };

		// Make layer control:
		this.layerControl = new L.Control.Layers(null, this.layerGroups, { hideSingleBase: true });
		this.layerControl.addTo(this.map);
	},


	makeLayerGroup: function(name) {
		// Make named layer:
		var newLayerGroup = new L.LayerGroup();
		//console.log("Made", name, newLayerGroup);

		// Add to map:
		newLayerGroup.addTo(this.map);

		// Add map control for this layer:
		this.layerControl.addOverlay(newLayerGroup, name);
		this.layerControl.expand();

		// Store it:
		this.layerGroups[name] = newLayerGroup;

		return newLayerGroup;
	},


	createPath: function(data) {
		// Convert Strava's Polyline to coords:
		var rideCoords = window.polyline.decode(data.path);

		// Create path:
		var ridePath = L.polyline(rideCoords, {
							color: ui.selectColour(data.rideId) || 'red',
							opacity: '0.8',
							className: 'rid' + data.rideId	// unique className will allow selection later
						});

		// Embed Strava activity data in path:
		data.color = ui.selectColour(data.rideId);
		ridePath.data = data;

		// Prepare its tooltip:
		ridePath.tooltipContent = `
			<h6 id="${data.rideId}" style="color:${data.color}">
				${data.title}</h6>
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

		return ridePath;
	},


	addPathToLayerGroup: function(path, layerName) {
		this.layerGroups[layerName].addLayer(path);
	},


	getLayerGroupByName: function(name) {
		for (var i = 0; i < this.layerGroups.length; i++) {
			var layerGroup = this.layerGroups[i];
			if (layerGroup.name === name) {
				return layerGroup.layer;
			}
		}
		return false;
	},


	highlightPath: function(rideId) {
		// Zoom map to path's bounds:
		var bounds = heatmap.paths[rideId].getBounds();
		heatmap.map.fitBounds(bounds, {padding: [20,20]});	// flyToBounds() is too slow and doesn't render paths

/*		// Give flyToBounds 2 seconds to complete:
		setTimeout(function() {

			// Create yellow bounding box:
			var flasher = L.rectangle(bounds, {weight: 1, color: "#333399",
											   fill: true, fillColor: "#0000ff", fillOpacity: "0.4",
											   className: "auto_hide"});
			flasher.addTo(this.map);

			// Fade, then remove:
			setTimeout(function(){
				$(".auto_hide").animate({opacity: 0}, 700, function() {
					flasher.remove();
				});
			}, 1000);
		}, 2000);*/
	},


	getClubNameById: function(cid) {
		if (ui.clubs.length > 0) {
			// Find matching club in the array:
			for (var i = 0; i < ui.clubs.length; i++) {
				var club = ui.clubs[i];
				if (club.id === cid) {
					// Match found:
					return club.name;
				}
			}
		}
		return false;
	},


	populateFriendsLayer: function() {
		// Scrape HTML:
		$(".friends-rides li").each(function(index, el) {
			var ride = $(el);
			heatmap.populateLayer(ride, "Friends");
		});
	},


	populateClubLayer: function(cid) {		// BETTER IF IT WORKED WITH data
		// Create new layer for this club:
		var clubname = this.getClubNameById(cid);
		heatmap.makeLayerGroup(clubname);
		console.log("Made map layerGroup:", clubname);

		// Scrape HTML:
		$(".club-rides[data-clubid='"+ cid +"'] li").each(function(index, el) {
			var ride = $(el);
			heatmap.populateLayer(ride, clubname);
		});
	},


	populateLayer: function(ride, layerName) {
		// Extract data-attributes from <li>:
		var data = {
			'rideId': ride.data('rideid'),
			'title': ride.data('title'),
			'date': ride.data('date'),
			'time': ride.data('time'),
			'type': ride.data('type'),
			'dist': ride.data('dist'),
			'elev': ride.data('elev'),
			'athlete': ride.data('athlete'),
			'avatar': ride.data('avatar'),
			'path': ride.data('summary')
		};

		if (data.path) {
			// Make path from the data:
			var newPath = heatmap.createPath(data);
			// Add path to the new layer:
			heatmap.addPathToLayerGroup(newPath, layerName);
			// Set path layer visible:
			heatmap.map.addLayer(newPath);
		}
	},


	filterPaths: function(filteredList) {
		console.log("Filtering to", filteredList.length, "paths");
		// Hide ALL paths momentarily:
		$('path.leaflet-interactive').hide();
		// Loop through filtered ride list:
		filteredList.forEach(function(ride) {
			//console.info('.rid' + ride.id);
			// Show paths with matching rideId in their className:
			$('.rid' + ride.id).show();
		});
		//console.log(this.countVisiblePaths());
	},


	filterHTML: function(filteredList) {


	},

	// Misleading function because Leaflet only renders as visible, what fits in the viewport...
	countVisiblePaths: function() {
		var visibles = $('path').filter(function() {
				return $(this).is(':visible');
		});
		return visibles.length + ' paths shown';
	}
};


var ui = {
	clubs: [],	// Filled after clubs ajax completes

	activeClub: null,	// SET *AFTER* DROPDOWN GENERATED

	getClubs: function() {
		// Ajax request to API:
		ajax.getClubs();
	},

	setClub: function(cid) {
		this.activeClub = cid;
	},

	selectColour: function(rid) {
		var lineColours = [
			'#f44336',
			'#8bc34a',
			'#fdd835',
			'#039be5',
			'#1a237e',
			'#e65100',
			'#aa00ff',
			'#f06292',
			'#cddc39',
			'#18ffff'
		];
		return lineColours[rid % 10];	// 0-9
	},

	// Add text colour to the ride titles, generating from the data-rideId:
	colourTitles: function() {
		$("li > h6").each(function(index, el) {
			var rid = $(el).parent().data("rideid");
			$(el).css("color", ui.selectColour(rid));
		});
	}
};
