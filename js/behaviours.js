/*global heatmap, renderer, ui, Zepto, $, L */

// DOM ready:
Zepto(function($) {
	heatmap.init();

	// Render the polyLines using the data we stored in the HTML <li> data-attributes:
	if (heatmap.map) {
		ajaxGetFriendsRides();
		ajaxGetClubs();
	}

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

	// Club selector AJAX behaviour:
	$('select[name="clubs"]').on('change', function() {
		var cid = $(this).find("option:checked").data("cid");
		// Check whether <ul> with data-clubid exists:
		var matches = $('.club-rides[data-clubid="' + cid + '"]');
		if (matches.length === 0) {
			// Load it by ajax:
			console.log('AJAX-fetching activites from club', cid);
			ajaxGetClubRides(cid);
		}
		else {
			// It already exists, so set it active:
			$(".club-rides").removeClass("active");
			$(matches).addClass("active");
		}
	});

	// Individual ride click behaviour:
	$('#rides ul').on('click', 'li', function(e) {
		// Highlight path:
		var rid = $(this).attr("data-rideid");
		heatmap.highlightPath(rid);
		// Unset & set selected:
		$(".selected").removeClass("selected");
		$(this).addClass("selected");
	});

	// Options form behaviour:
	$('#options a[name="options"]').click(function() {
		var form = $('form[name=map-options]');

		if ($(form).hasClass("open")) {
			$(form).removeClass("open");
			$(this).children('span').html("&rtrif;");	// icon ▸ (closed)
		}
		else {
			$(form).addClass("open");
			$(this).children('span').html("&dtrif;");	// icon ▾ (open)
		}
	});

	// Form checkboxes to perform filtering:
	$('form[name="map-options"] input[type="checkbox"]').on('change', function() {
		console.log($(this).val());
	});

	// Form text fields to perform filtering
	$('form[name="map-options"] input[type="text"]').on('keyup', function() {
		console.log($(this).val());
	});

	// Hide autohide elements after delay:
	$('.autohide').each(function(index, el) {
		setTimeout(function(el) {
			// Slide it left:
			$(el).animate({"left": "-100%"}, 1000);	// NOT WORKING
		}, 2000);
	});

});
