/*global heatmap, renderer, ui, Zepto, $, L, rides, ajax, mode, user */
var heatmap = {

	map: null,
	layerGroups: null,		// friends, club1, club2...
	layerControl: null,
	paths: {},	//?

	init: function() {
		// Define MapBox basemap ('light'):
		var attribution = `&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> + <a href="http://mapbox.com">Mapbox</a>`,
			mapboxBaseUrl = 'https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token=',
			access_token = 'pk.eyJ1IjoibWVlcmthdG9yIiwiYSI6ImNpdXF4Mm91azAwMGEyb21pcDFmN3J5NXcifQ.pW6SQDz9wpFr619vzHtcAA';

		var lightBase = L.tileLayer(
			mapboxBaseUrl + access_token, {
			    attribution: attribution,
			    maxZoom: 20,
				id: 'lightBase'
		});

		var bristol = [51.400, -2.600],
			europe = [48,10],
			world = [35,0];

		// Initialise map:
		this.map = L.map('map', {
			center: world,
			zoom: 1,
			layers: [lightBase]
		});

		this.locateUser();

		this.initLayers();
	},


	initLayers: function() {
		// Set up initial layers:
        this.layerGroups = { "Friends": new L.LayerGroup() };

		// Make layer control:
		this.layerControl = new L.Control.Layers(null, this.layerGroups, { hideSingleBase: true });
		this.layerControl.addTo(this.map);
	},


	// Use Ajax to Geo-lookup user's hometown:
	locateUser: function() {
		if (mode && mode === 'logged') {
			if (user.city) {
				ajax.geoLookup(user.city, user.country);
			}
		}
	},


	// Zoom map to user:
	zoomMap(center, zoom) {
		heatmap.map.setView(center, zoom);
	},


	makeLayerGroup: function(name) {
		// Make named layer:
		var newLayerGroup = new L.LayerGroup();
		//console.log("Made", name, newLayerGroup);

		// Add to map:
		newLayerGroup.addTo(this.map);

		// Add map control for this layer:
		this.layerControl.addOverlay(newLayerGroup, name);
		//this.layerControl.expand();

		// Store it:
		this.layerGroups[name] = newLayerGroup;

		return newLayerGroup;
	},


	createPath: function(data) {
		// Convert Strava's Polyline to coords using 3rd party polyline library:
		var rideCoords = window.polyline.decode(data.path);

		// Create path:
		var ridePath = L.polyline(rideCoords, {
							color: ui.selectColour(data.rideId) || 'red',
							opacity: '0.8',
							weight: 3,
							className: 'rid' + data.rideId	// unique className will allow selection later
						});

		// Embed Strava activity data in path:
		data.color = ui.selectColour(data.rideId);
		ridePath.data = data;

		// Prepare its tooltip:
		ridePath.tooltipContent = this.preparePathTooltip(data);

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


	preparePathTooltip(data) {
		return `
			<h6 id="${data.rideId}" style="color:${data.color}">
				<span class="icon ${data.type.toLowerCase()}"></span>
				${data.title}
				${renderer.makeRideLink(data.rideId)}
			</h6>
			<img class='avatar' src='${data.avatar}'>
			<span class='date'>${data.date}&nbsp;${data.time}</span>
			<div class='athlete'>
				${renderer.makeAthleteLink(data.athleteId, data.athlete)}
			</div>
			<span class="stats">&roarr;&nbsp;${data.dist}</span>
			<span class="stats">&lrtri;&nbsp;${data.elev}</span>
			<span class="stats">&raquo;&nbsp;${data.speed}</span>
			<span class="icon kudos ${data.hasKudoed ? 'given' : ''}">${data.kudosCount}</span>
		`;
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

		// Reset style for all paths:
		$.each(heatmap.paths, function(index, path){
			path.setStyle({
				opacity: 0.6,
				weight: 3
			});
		});

		// Boost its opacity and width:
		heatmap.paths[rideId].setStyle({
			opacity: 1,
			weight: 4
		});
		// Bring to front using z-index: layer.bringToFront():
		heatmap.paths[rideId].bringToFront();
		// Open its popup:
		heatmap.paths[rideId].openPopup();	// NOT WORKING?
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
			'speed': ride.data('speed'),
			'athlete': ride.data('athlete'),
			'athleteId': ride.data('athleteid'),
			'avatar': ride.data('avatar'),
			'path': ride.data('summary'),
			'kudosCount': ride.data('kudos-count'),
			'hasKudoed': ride.data('has-kudoed')
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
	},

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

	// Generate the path/title colour based on the rideId:
	selectColour: function(rid) {
		var lineColours = [
			'#c543a9',
			'#ff99ff',
			'#e62e00',
			'#e6726f',
			'#ffa124',
			'#ffca99',
			'#ffe600',
			'#cccc00',
			'#bae221',
			'#91e8af',
			'#00c17a',
			'#7ddfff',
			'#5395e0',
			'#0054b6',
			'#cc99ff',
			'#5500cc'
		];
		return lineColours[rid % 16];	// 0-15
	},

	// Add text colour to the ride titles:
	colourTitles: function() {
		$("li > h6").each(function(index, el) {
			var rid = $(el).parent().data("rideid");
			$(el).css("color", ui.selectColour(rid));
		});
	},

	// Filter down the HTML lists according to filters:
	filterHTML: function(filteredList) {
		// Hide ALL <li>s momentarily:
		$('li').hide();
		filteredList.forEach(function(ride) {
			// Show <li> items with matching rideId in their data attributes:
			$('li[data-rideid="'+ ride.id +'"]').show();
		});
	},

	// Set which of the 2 main tabs is active:
	setActiveTab(tab) {
		if (tab === 'friends') {
			$("#sidebar").removeClass('clubs').addClass('friends');
			$('#clubs-btn').removeClass('button-primary');
			$('#friends-btn').addClass('button-primary');
		}
		else if (tab === 'clubs') {
			$("#sidebar").removeClass('friends').addClass('clubs');
			$('#friends-btn').removeClass('button-primary');
			$('#clubs-btn').addClass('button-primary');
		}
	},

	attachLiClickListeners() {
		// Individual ride click behaviour:
		$('#rides ul').on('click', 'li', function(e) {
			// Highlight path:
			var rid = $(this).attr("data-rideid");
			heatmap.highlightPath(rid);
			// Unset & set selected:
			$(".selected").removeClass("selected");
			$(this).addClass("selected");
		});
	}
};
