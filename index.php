<?php
// Initialise debug console:
require_once(__DIR__ . '/vendor/php-console/php-console/src/PhpConsole/__autoload.php');
$isActiveClient = PhpConsole\Connector::getInstance()->isActiveClient();

require_once('config.inc.php');
require_once('strava-master/StravaApi.php');
include_once('functions.inc.php');

// Initialise API caller:
$api = new Iamstuartwilson\StravaApi(
	$clientId,
	$clientSecret
);
$api->setAccessToken($accessToken);


// Start HTML:
include('header.inc.php');

echo '<div id="map"></div>';


// Get me:
//$myid = 586419;
//$me = $api->get("athlete");
//print_athlete($me);
//echo '<hr>';
//$mystats = $api->get("athletes/$myid/stats");
//print_stats($mystats);
//echo '<hr>';

include('form.inc.php');

echo '<div id="rides">';
	// Get friends' rides:
	echo '<ul id="friends_rides">';
		$friend_rides = $api->get("activities/following", ['per_page' => 10, 'page' => 1]);
		print_list_items($friend_rides);
	echo '</ul>';

	// Get club rides:
	echo '<ul id="club_rides" style="display:none">';
		$club_rides = $api->get("clubs/10360/activities", ['per_page' => 20, 'page' => 1]);
		print_list_items($club_rides);
	echo '</ul>';
echo '</div>';


include('footer.inc.php');