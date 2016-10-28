<?php
include_once('debugger.inc.php');
require_once('config.inc.php');
require_once('strava-master/StravaApi.php');
include_once('functions.inc.php');

// Initialise API caller:
$api = new Iamstuartwilson\StravaApi(
	$clientId,
	$clientSecret
);
$api->setAccessToken($accessToken);


// Sanitise incoming GET request:
$resource = trim($_GET['resource']);
$id = (int)trim($_GET['id']);

if(!isset($resource)|| empty($resource)) {
	echo 'Invalid or missing resource';
}
else {
	// In each case, make API call, then format return string as HTML:
	$html = '';

	if ($resource == 'club_activities') {
		$html = print_list_items(get_club_activities($id));
	}
	else if ($resource == 'friend_activities') {
		$html = print_list_items(get_friend_activities());
	}
	else if ($resource == 'clubs') {
		$html = print_clubs(get_athlete_clubs(1));
	}
	else if ($resource == 'athlete') {
		$html = print_athlete($api->get("athlete"));
	}

	// Output data for ajax response:
	echo json_encode($html);
}


function get_athlete_clubs($ath_id = null) {
	global $api;
	
	if (!$ath_id) {
		return [10360];	// road.cc
	}
	else {
		$club_list = $api->get("athlete/clubs");
		
		if (is_array($club_list)) {
			return $club_list;	
		}
	}
}


function get_club_activities($club_id) {
	global $api;

	$club_rides = $api->get("clubs/".$club_id."/activities", ['per_page' => 30, 'page' => 1]);
	
	if (is_array($club_rides)) {
		return $club_rides;	
	}
}


function get_friend_activities() {
	global $api;

	$friend_rides = $api->get("activities/following", ['per_page' => 20, 'page' => 1]);
	
	if (is_array($friend_rides)) {
		return $friend_rides;	
	}
}
