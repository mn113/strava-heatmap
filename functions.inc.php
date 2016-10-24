<?php

// Improve Strava's datetime formatting:
function format_date($utc_date) {
	$d = strtotime($utc_date);
	return date('Y-m-d', $d);
}


// Improve Strava's distance formatting:
function format_km($metres) {
	return number_format($metres / 1000, 1) . 'km';		// 1 decimal place
}


// Print a single formatted line with some athlete data:
function print_athlete($ath) {
	echo $ath->id . ' | ' . $ath->firstname . ' ' . $ath->lastname . ' | ' . $ath->city;
}


// Print a single formatted line with ride data and athlete data:
function print_ride_details($ride) {
	echo format_date($ride->start_date_local) . ' | ' . $ride->name . ' | ' . 
		 format_km($ride->distance) . ' | ' . $ride->total_elevation_gain . 'm => ';
	print_athlete($ride->athlete);
}


// Print a single formatted line of stats:
function print_stats($stats) {
	echo 'Biggest climb: ' . $stats->biggest_climb_elevation_gain . 'm | '.
		 'Total distance: ' . format_km($stats->all_ride_totals->distance);	
}


// Insert a ride's polyline code into the page as a js-var:
function print_ridemap($ride) {
	echo '<script type="text/javascript">var myLine = "' . $ride->map->summary_polyline . '";</script>';
}

