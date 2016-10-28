<?php

// Improve Strava's datetime formatting:
function format_date($utc_date) {
	$d = strtotime($utc_date);
	return [date('d M', $d), date('H:i', $d)];
}


// Improve Strava's distance formatting:
function format_km($metres) {
	return '&roarr;&nbsp;' . number_format($metres / 1000, 1) . 'km';		// 1 decimal place
}


// Improve Strava's elevation formatting:
function format_elev($metres) {
	return '&lrtri;&nbsp;' . number_format($metres, 0) . 'm';
}


// Return html of fetched activities as list items:
function print_list_items($rides) {
//	\PC::debug(count($rides), 'rides fetched');	// 20
	$html = '';
	foreach ($rides as $ride) {
		$html .= '<li';
		$html .= print_ride_data_attributes($ride, $ride->athlete);
		$html .= '>';
		$html .= print_ride_details($ride);
		$html .= '</li>';
	}
	return $html;
}


// Return the inline data-attributes for the list item html:
function print_ride_data_attributes($ride, $ath) {
	$html  = ' data-rideId="'. $ride->id . '"';
	$html .= ' data-date="'. format_date($ride->start_date_local)[0] . '"';
	$html .= ' data-time="'. format_date($ride->start_date_local)[1] . '"';
	$html .= ' data-title="'. $ride->name . '"';
	$html .= ' data-type="'. $ride->type . '"';
	$html .= ' data-dist="'. format_km($ride->distance) . '"';
	$html .= ' data-elev="'. format_elev($ride->total_elevation_gain) . '"';
	$html .= ' data-athlete="'. $ath->firstname . ' ' . $ath->lastname . '"';
	$html .= ' data-avatar="'. $ath->profile . '"';
	$html .= ' data-summary="'. $ride->map->summary_polyline . '"';
	return $html;
}


// Return html with ride data and athlete data:
function print_ride_details($ride) {
	$html  = '<h6>'. $ride->name .'</h6>';
	$html .= '<span>'. format_date($ride->start_date_local)[0] . ' ' . format_date($ride->start_date_local)[1] .'</span>';
	$html .= '<div>';
	$html .= print_athlete($ride->athlete);
	$html .= '</div>';
	$html .= '<span>'. format_km($ride->distance) .'</span>';
	$html .= '<span>'. format_elev($ride->total_elevation_gain) . '</span>';
	$html .= '<span class="icon '. $ride->type .'">';
	return $html;
}


// Return html with some athlete data:
function print_athlete($ath) {
	$html  = '<img class="avatar" src="'. $ath->profile .'">';
	$html .= '<span class="athlete">'. $ath->firstname . ' ' . $ath->lastname .'</span>';
	$html .= '<span>'. $ath->city .'</span>';
	return $html;
}


// Return html with a line of stats:
function print_stats($stats) {
	$html  = '<span>Biggest climb: ' . $stats->biggest_climb_elevation_gain . 'm</span>';
	$html .= '<span>Total distance: ' . format_km($stats->all_ride_totals->distance) . '</span>';
	return $html;
}


// Return html with the clubs dropdown options:
function print_clubs($clubs) {
//	\PC::debug(count($clubs), 'clubs fetched');	// 3
	$html = '';
	foreach ($clubs as $club) {
		$html .= '<option data-cid="';
		$html .= $club->id;
		$html .= '">';
		$html .= $club->name;
		$html .= '</option>';
	}
	return $html;
}



/*
// Echo a PHP Strava API object into a js-var on document.heatmap:
function strava2java($ride) {
	echo '<script>';
		echo 'heatmap.rides['. $ride->id .'] = json_encode('. $ride .');';
	echo '</script>';
}
*/