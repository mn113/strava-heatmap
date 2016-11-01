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

	// Hide autohide elements after delay:		// DOESN'T WORK
	$('.autohide').each(function() {
		var el = $(this);
		setTimeout(function() {
			// Slide it left:
			$(el).animate({"left": "-100%"}, 1500);	// NOT WORKING
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
	$('#map-options input[type="text"]').on('keyup', function() {
		var elName = $(this).attr("name"),
			elVal = $(this).val();
		//console.log(elName, elVal);

		// Set properties of rides.filter object:
		rides.filter[elName] = elVal;
		// Perform map filtering:
		heatmap.filterPaths(rides.applyFilter());
		ui.filterHTML(rides.applyFilter());
	});

	// Close modal on link click:
 	$('.modal-dialog a').click(function() {
		$('.modal-bg').hide();
	});

});
