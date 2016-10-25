<?php

// Improve Strava's datetime formatting:
function format_date($utc_date) {
	$d = strtotime($utc_date);
	return date('d M', $d);
}


// Improve Strava's distance formatting:
function format_km($metres) {
	return number_format($metres / 1000, 1) . 'km';		// 1 decimal place
}


// Print a list of fetched activities as list items:
function print_list_items($rides) {
	foreach ($rides as $ride) {
		$ath = $ride->athlete;
		echo '<li data-rideId="'. $ride->id . '"' . 
			' data-date="'. format_date($ride->start_date_local) . '"' . 
			' data-title="'. $ride->name . '"' .
			' data-dist="'. format_km($ride->distance) . '"' . 
			' data-elev="'. $ride->total_elevation_gain . '"' . 
			' data-athlete="'. $ath->firstname . ' ' . $ath->lastname . '"' . 
			' data-avatar="'. $ath->profile . '"' .
			' data-summary="'. $ride->map->summary_polyline . '">';
			echo '<input type="checkbox" name="'. $ride->id .'" checked>';
			print_ride_details($ride);
		echo '</li>';
	}
}


// Print a single formatted line with ride data and athlete data:
function print_ride_details($ride) {
	echo '<span>'. format_date($ride->start_date_local) .'</span>';
	echo '<span>'. $ride->name .'</span>';
	echo '<span>'. format_km($ride->distance) .'</span>';
	echo '<span>'. $ride->total_elevation_gain . 'm</span>';
	echo '<div>';
		print_athlete($ride->athlete);
	echo '</div>';
}


// Print a single formatted line with some athlete data:
function print_athlete($ath) {
	echo '<img class="avatar" src="'. $ath->profile .'">';
	echo '<span>'. $ath->firstname . ' ' . $ath->lastname .'</span>';
	echo '<span>'. $ath->city .'</span>';
}


// Print a single formatted line of stats:
function print_stats($stats) {
	echo '<span>Biggest climb: ' . $stats->biggest_climb_elevation_gain . 'm</span>';
	echo '<span>Total distance: ' . format_km($stats->all_ride_totals->distance) . '</span>';
}
