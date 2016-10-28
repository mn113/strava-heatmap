/*global L, $, Zepto*/
var heatmap = {

	map: null,
	layerGroups: { "Friends": new L.LayerGroup() },		// friends, club1, club2...
	layerControl: null,
	paths: {},	//?
//	rides: {},	//?			// use one of these for toggling data?


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
//		var firstLayer = {
//		    "Friends": new L.LayerGroup()	// empty to begin with
//		};
		// Make layer control:
		this.layerControl = new L.Control.Layers(null, this.layerGroups, { hideSingleBase: true });
		this.layerControl.addTo(this.map);
	},


	makeLayerGroup: function(name) {
		// Make named layer:
		var newLayerGroup = new L.LayerGroup();
		console.log("Made", name, newLayerGroup);

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
							opacity: '0.8'
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


	getLayerByName: function(name) {
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
		heatmap.map.flyToBounds(bounds, {padding: [20,20]});

		// Give flyToBounds 2 seconds to complete:
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
		}, 2000);
	},


	populateFriendsLayer: function() {
		$(".friends_rides li").each(function(index, el) {
			var ride = $(el);
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
			// Add path to the Friends layer:
			var newPath = heatmap.createPath(data);
			heatmap.addPathToLayerGroup(newPath, 'Friends');

			// Set layer visible:
//			heatmap.map.addLayer(heatmap.getLayerByName('Friends'));
		});
	},


	populateClubLayer: function(cid) {
		// Create new layer for this club:
//		var clubname = 'TBD';	// TODO!
		console.log("Making map layer: Club" + cid);
		heatmap.makeLayerGroup('Club'+cid);
		console.log(heatmap.map.hasLayer('Club'+cid));	// false

		// Set layer visible:
//		heatmap.map.addLayer(heatmap.layerGroups['Club'+cid]);	// ERROR

		$(".club_rides[data-clubid='"+ cid +"'] li").each(function(index, el) {
			var ride = $(el);
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

			// Make path from the data:
			var newPath = heatmap.createPath(data);

			// Add path to the new layer:
			heatmap.addPathToLayerGroup(newPath, 'Club'+cid);
		});
	}
};


var ui = {
	clubs: [],	// FILL THIS *AFTER* DROPDOWN GENERATED

	activeClub: null,	// SET *AFTER* DROPDOWN GENERATED

	getClubs: function() {
		// Ajax request to API:
		ajaxGetClubs();
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
};


// DOM ready:
Zepto(function($) {
	heatmap.init();

	// Render the polyLines using the data we stored in the HTML <li> data-attributes:
	if (heatmap.map) {
		ajaxGetFriendsRides();
	}


	// Club selector AJAX behaviour:
	$("select[name=clubs]").on("change", function() {
		var cid = $(this).find("option:checked").data("cid");
		// Check whether <ul> with data-clubid exists:
		var matches = $('.club_rides[data-clubid="' + cid + '"]');
		if (matches.length === 0) {
			// Load it by ajax:
			console.log('AJAX-fetching activites from club', cid);
			ajaxGetClubRides(cid);
		}
		else {
			// It already exists, so set it active:
			$(".club_rides").removeClass("active");
			$(matches).addClass("active");
		}
	});


	// Tab-like behaviour for main buttons:
	$('#friends-btn').click(function() {
		$("#sidebar").removeClass('clubs').addClass('friends');
		$('#clubs-btn').removeClass('button-primary');
		$(this).addClass('button-primary');
	});
	$('#clubs-btn').click(function() {
		$("#sidebar").removeClass('friends').addClass('clubs');
		$('#friends-btn').removeClass('button-primary');
		$(this).addClass('button-primary');
	});


	// Individual ride click behaviour:
	$("#rides ul li").on('click', function() {
		// Highlight path:
		var rid = $(this).attr("data-rideid");
		heatmap.highlightPath(rid);
		// Unset & set selected:
		$(".selected").removeClass("selected");
		$(this).addClass("selected");
	});


	// Add text colour to the ride titles, generating from the data-rideId:
	$("li > h6").each(function(index, el) {
		var rid = $(el).parent().data("rideid");
		$(el).css("color", ui.selectColour(rid));
	});

});
