<?php
include_once('debugger.inc.php');
require_once('config.inc.php');
require_once('StravaApi.php');
include_once('functions.inc.php');

if(isset($_COOKIE['user_access_token']) && !empty($_COOKIE['user_access_token'])) {
	// Receive access token from requester:
	$access_token = $_COOKIE['user_access_token'];
	$mode = 'logged';
}
else {
	// If no cookie, fall back to MY token:
	$access_token = PERSONAL_ACCESS_TOKEN;
	$mode = 'demo';
}

// Initialise API caller:
$api = new Iamstuartwilson\StravaApi(
	CLIENT_ID,
	CLIENT_SECRET
);
$api->setAccessToken($access_token);

// Get current user:
$user = $api->get("athlete");

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
		$html = get_club_activities($id);
	}
	else if ($resource == 'friend_activities') {
		$html = get_friend_activities();
	}
	else if ($resource == 'clubs') {
		$html = get_athlete_clubs(1);
	}
	else if ($resource == 'athlete') {
		$html = $api->get("athlete");
	}

	// Output data for ajax response:
	echo json_encode($html);
}


// API-calling function block:
function get_athlete_clubs($ath_id = null) {
	global $api;

	if (!$ath_id) {
		return [116475];	// Encourage Someone club
	}
	else {
		$club_list = $api->get("athlete/clubs");

		if (is_array($club_list)) {
			return $club_list;
		}
	}
}


// API-calling function block:
function get_club_activities($club_id) {
	global $api;
	global $mode;

	$number = ($mode == 'demo') ? 100 : 30;

	$club_rides = $api->get("clubs/".$club_id."/activities", ['per_page' => $number, 'page' => 1]);

	if (is_array($club_rides)) {
		return $club_rides;
	}
}


// API-calling function block:
function get_friend_activities() {
	global $api;

	$friend_rides = $api->get("activities/following", ['per_page' => 30, 'page' => 1]);

	if (is_array($friend_rides)) {
		return $friend_rides;
	}
}
