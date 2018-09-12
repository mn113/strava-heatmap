/*global heatmap, renderer, ui, Zepto, $, L, rides, ajax */

var ajax = {};

// Ask php backend to GET the latest rides of a club
ajax.getClubRides = function (cid) {
	console.log('ajax.getClubRides('+ cid +')');
	$(".reload").hide().off('click');

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

			console.log(data);
			
			// Store data in raw form:
			data.forEach(function(el) {
				rides.all.push(el);
			});

			$(".club-rides").removeClass("active");
			// Make a new list container, tag it, and append to div:
			var el = $("<ul></ul>");
			el.addClass("club-rides active");
			el.data("clubid", cid);
			el.html(renderer.printListItems(data));
			$("#rides").append(el);
			ui.colourTitles();
			// Attach event listener for li clicks:
			ui.attachLiClickListeners();

			// HTML is done, so scrape it to load rides into a new map layer:
			heatmap.populateClubLayer(cid);

			// Filter displayed data:
			heatmap.filterPaths(rides.applyFilter());
			ui.filterHTML(rides.applyFilter());
		},
		error: function() {
			console.log("Failed to load club rides for", cid);
			// Create "try again" button:
			$(".reload").on('click', function() {
				ajax.getClubRides(cid);
			}).show();
		}
	});
};


// Ask php backend to GET the latest rides of athlete's friends
ajax.getFriendsRides = function() {
	console.log('ajax.getFriendsRides()');
	$(".reload").hide().off('click');

	$.ajax({
		url: 'apirequests.php',
		// data to be added to query string:
		data: {
			resource: 'friend_activities'
		},
		dataType: 'json',
		timeout: 3000,
		success: function(data) {
			// Store data in raw form:
			data.forEach(function(el) {
				rides.all.push(el);
			});

			// Process JSON to HTML and insert into the container <ul>:
			$(".friends-rides").html(renderer.printListItems(data));
			ui.colourTitles();
			// Attach event listener for li clicks:
			ui.attachLiClickListeners();

			// HTML is done, so scrape it to load rides into a new map layer:
			heatmap.populateFriendsLayer();

			// Filter displayed data:
			heatmap.filterPaths(rides.applyFilter());
			ui.filterHTML(rides.applyFilter());
		},
		error: function() {
			console.log("Failed to load friend rides");
			// Show "try again" button, attaching new click listener:
			$(".reload").on('click', function() {
				ajax.getFriendsRides();
			}).show();
		}
	});
};


// Ask php backend to GET the clubs of the signed-in athlete:
ajax.getClubs = function() {
	console.log('ajax.getClubs()');

	$.ajax({
		url: 'apirequests.php',
		// data to be added to query string:
		data: {
			resource: 'clubs'
		},
		dataType: 'json',
		timeout: 3000,
		success: function(data) {
			// Store data in raw form:
			ui.clubs = data;

			// Append to html:
			$('select[name="clubs"]').html(renderer.printClubs(data));
			//console.log(data);

			// Get first club id from HTML and fetch its rides:
			var cid = $("select[name=clubs] option:first-child").data("cid");
			ajax.getClubRides(cid);

			ui.setClub(cid);
		}
	});
};


ajax.geoLookup = function(city, country) {
	var url = "https://maps.googleapis.com/maps/api/geocode/json?address=" + city + ',' + country;
	$.getJSON(url, function(data) {
		if (data.status === 'OK') {
//			console.log(data.results[0].geometry.location);
//			return data.results[0].geometry.location;
			heatmap.zoomMap(data.results[0].geometry.location, 9);
		}
	});
};

var renderer = {};  // put all render functions in here

// Improve Stravas datetime formatting:
renderer.formatDate = function(utcDate) {
	var d = new Date(utcDate);
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	return d.getDate() + ' ' + months[d.getMonth()];
};

renderer.formatTime = function(utcDate) {
	var d = new Date(utcDate);
	var hours = d.getHours(),
		minutes = d.getMinutes();
	// Zero-fill:
	if (hours < 10) { hours = '0' + hours; }
	if (minutes < 10) { minutes = '0' + minutes; }
	return hours + ':' + minutes;
};

// Improve Stravas distance formatting (m -> km):
renderer.formatKm = function(metres) {
	return (metres / 1000).toFixed(1) + 'km';	// 1 decimal place
};

// Improve Stravas elevation formatting:
renderer.formatElev = function(metres) {
	return metres.toFixed(0) + 'm';
};

// Improve Stravas speed formatting (m/s -> km/h):
renderer.formatSpeed = function(ms) {
	return (ms * 3.6).toFixed(1) + 'km/h';
};


// Return html of fetched activities as list items:
renderer.printListItems = function(rides) {
	var html = '';
    for (var i = 0; i < rides.length; i++) {
        var ride = rides[i];
		// It must have a polyline to be included:
		if (ride.map.summary_polyline) {
			html += `<li ${renderer.printRideDataAttributes(ride, ride.athlete)}>
			         ${renderer.printRideDetails(ride, ride.athlete)}
			         </li>`;
		}
    }
	return html;
};

// Return the inline data-attributes for the list item html:
renderer.printRideDataAttributes = function(ride, ath) {
	var html = `data-rideid="${ride.id}"
            	data-date="${renderer.formatDate(ride.start_date_local)}"
            	data-time="${renderer.formatTime(ride.start_date_local)}"
            	data-title="${ride.name}"
            	data-type="${ride.type}"
            	data-dist="${renderer.formatKm(ride.distance)}"
            	data-elev="${renderer.formatElev(ride.total_elevation_gain)}"
				data-speed="${renderer.formatSpeed(ride.average_speed)}"
            	data-athlete="${ath.firstname} ${ath.lastname}"
				data-athleteid="${ath.id}"
            	data-avatar="${ath.profile}"
            	data-summary="${ride.map.summary_polyline}"
				data-kudos-count=${ride.kudos_count}
				data-has-kudoed=${ride.has_kudoed}`;
	return html;
};

// Return html with ride data and athlete data:
renderer.printRideDetails = function(ride, ath) {
	var html = `<h6>
					<span class="icon ${ride.type.toLowerCase()}"></span>
					${ride.name}
					${renderer.makeRideLink(ride.id)}
				</h6>
            	<span>${renderer.formatDate(ride.start_date_local)} ${renderer.formatTime(ride.start_date_local)}</span>
            	<div>
					${renderer.printAthlete(ath)}
				</div>
            	<span class="stats">&roarr;&nbsp;${renderer.formatKm(ride.distance)}</span>
            	<span class="stats">&lrtri;&nbsp;${renderer.formatElev(ride.total_elevation_gain)}</span>
				<span class="stats">&raquo;&nbsp;${renderer.formatSpeed(ride.average_speed)}</span>
				<span class="icon kudos ${ride.has_kudoed ? 'given' : ''}">${ride.kudos_count}</span>
				`;
    return html;
};

// Return html with some athlete data:
renderer.printAthlete = function(ath) {
	var html = `<img class="avatar" src="${ath.profile}">
            	<span class="athlete">${renderer.makeAthleteLink(ath.id, ath.firstname+' '+ath.lastname)}</span>
            	<span class="city">(${ath.city})</span>`;
	return html;
};

// Return html with the clubs dropdown options:
renderer.printClubs = function(clubs) {
	var html = '';
    for (var i = 0; i < clubs.length; i++) {
        var club = clubs[i];
		html += `<option data-cid="${club.id}">${club.name}</option>`;
	}
	return html;
};

// Make a link to a Strava athlete:
renderer.makeAthleteLink = function(id, text) {
	return `<a target="_blank" href="http://www.strava.com/athletes/${id}">${text}</a>`;
};
// Make a link to a Strava ride:
renderer.makeRideLink = function(id) {
	return `<a target="_blank" class="stravalink" href="http://www.strava.com/activities/${id}"></a>`;
};

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

/*global heatmap, renderer, ui, Zepto, $, L, rides, ajax, mode */

// DOM ready:
Zepto(function($) {
	heatmap.init();

	// Render the polyLines using the data we stored in the HTML <li> data-attributes:
	if (heatmap.map) {
		if (mode === 'logged') { ajax.getFriendsRides(); }
		ajax.getClubs();
	}
	if (mode === 'demo') {
		ui.setActiveTab('clubs');
	}

	// Hide autohide elements after delay:
	$('.autohide').each(function() {
		var el = $(this);
		setTimeout(function() {
			// Slide it left:
			$(el).animate({"left": "-100%"}, 1500);
		}, 2000);
	});

	// Tab-like behaviour for main buttons:
	$('#friends-btn').click(function() {
		ui.setActiveTab('friends');
	});
	$('#clubs-btn').click(function() {
		ui.setActiveTab('clubs');
	});

	// Club selector AJAX behaviour:
	$('select[name="clubs"]').on('change', function() {
		var cid = $(this).find("option:selected").data("cid");
		// Check whether <ul> with data-clubid exists:
		var matches = $('.club-rides[data-clubid="' + cid + '"]');
		if (matches.length === 0) {
			// Load it by ajax:
			console.log('AJAX-fetching activites from club', cid);
			ajax.getClubRides(cid);
		}
		else {
			// It already exists, so set it active:
			$(".club-rides").removeClass("active");
			$(matches).addClass("active");
		}
	});

	// Options form behaviour:
	$('#options > a').click(function() {
		var form = $('#map-options');

		if ($(form).hasClass("open")) {
			$(form).removeClass("open");
			$(this).children('span').html("&rtrif;");	// icon ▸ (closed)
		}
		else {
			$(form).addClass("open");
			$(this).children('span').html("&dtrif;");	// icon ▾ (open)
		}
	});

	// Form checkboxes perform filtering:
	$('#map-options input[type="checkbox"]').on('change', function() {
		var elName = $(this).attr("name"),
			elChecked = $(this).prop("checked");
		//console.log(elName, elChecked);

		// Set properties of rides.filter object:
		rides.filter[elName] = elChecked;
		// Perform map filtering:
		heatmap.filterPaths(rides.applyFilter());
		ui.filterHTML(rides.applyFilter());
	});

	// Form text fields to perform filtering
	$('#map-options input[type="number"]').on('change', function() {
		var elName = $(this).attr("name"),
			elVal = $(this).val();
		//console.log(elName, elVal);

		// Basic HTML5 validation (only act upon input value if it's in range):
		if (this.validity.valid) {
			// Set properties of rides.filter object:
			rides.filter[elName] = elVal;
			// Perform map filtering:
			heatmap.filterPaths(rides.applyFilter());
			ui.filterHTML(rides.applyFilter());
		}
		else { console.log($(this).val(), this.validity); }
	});

	// Close modal on link click:
 	$('.modal-dialog a').click(function() {
		$('.modal-bg').hide();
	});

	// Close cookie message:
	$('.cookie-message a').click(function() {
		$(this).parent().addClass('hidden');
		document.cookie = "okCookies=true";
	});

});

/*global heatmap, renderer, ui, Zepto, $, L, rides, ajax, user */

var rides = {
    all: [],    // Main ride store for the whole app

    filter: {  // default values:
        excludeSelf: false,
        includeRides: true,
        includeRuns: false,
        includeOthers: false,
        dateRange: 7,  // days
        minDistance: 2,
        maxDistance: 200
    },

    arrayifyTypes: function() {
        var types = [];
        if (rides.filter.includeRides) { types.push('rides'); }
        if (rides.filter.includeRuns) { types.push('runs'); }
        if (rides.filter.includeOthers) { types.push('others'); }
        return types;
    },

    applyFilter: function() {
        // Chain all our filter functions based on the filter object's values:
        var filt1 = rides.filterSelf(rides.all);
        var filt2 = rides.filterByType(filt1);
        var filt3 = rides.filterByDateRange(filt2);
        var filt4 = rides.filterByDistance(filt3);
        return filt4;
    },

    filterSelf: function(collection) {
        // Do filtering:
        var filtered = collection.filter(function(ride) {
            // Athlete id filtering only needed if excluding self:
            return (!rides.filter.excludeSelf || ride.athlete.id !== user.id);
        });
        //console.log(filtered.length, 'matches on self');
        return filtered;
    },

    filterByType: function(collection) {
        var types = rides.arrayifyTypes();
        // Do filtering:
        var filtered = collection.filter(function(ride) {
            return (
                (ride.type === 'Ride' && types.indexOf('rides') !== -1) ||
                (ride.type === 'Run' && types.indexOf('runs') !== -1) ||
                (ride.type !== 'Ride' && ride.type !== 'Run' && types.indexOf('others') !== -1)
            );
        });
        //console.log(filtered.length, 'matches by type');
        return filtered;
    },

    filterByDateRange: function(collection) {
        // Compute start date:
        var days = rides.filter.dateRange;
        var beginTime = new Date().getTime() - (days * 24 * 60 * 60 * 1000); // X days ago

        // Do filtering:
        var filtered = collection.filter(function(ride) {
            var activityTime = new Date(ride.start_date_local).getTime();
            return (activityTime > beginTime);
        });
        //console.log(filtered.length, 'matches by date');
        return filtered;
    },

    filterByDistance: function(collection) {
        // Do filtering:
        var filtered = collection.filter(function(ride) {
            // Between min and max please:
            return (ride.distance / 1000 > rides.filter.minDistance) &&
                    (ride.distance / 1000 < rides.filter.maxDistance);
        });
        //console.log(filtered.length, 'matches by distance');
        return filtered;
    }
};
