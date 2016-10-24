<?php
	// Initialise debug console:
$connector = \PhpConsole\Connector::getInstance();

require_once('config.inc.php');
require_once('strava-master/StravaApi.php');
include_once('functions.php');

// Initialise API caller:
$api = new Iamstuartwilson\StravaApi(
	$clientId,
	$clientSecret
);
$api->setAccessToken($accessToken);


// Start HTML:
include('header.inc.php');


// Get me:
$myid = 586419;
$me = $api->get("athlete");
print_athlete($me);
echo '<hr>';
$mystats = $api->get("athletes/$myid/stats");
print_stats($mystats);
echo '<hr>';

// Get one club member:
$roadcc = $api->get("clubs/10360/members");
$aguy = $roadcc[rand(0,10)];
print_athlete($aguy);
echo '<hr>';

// Get a ride:
$aride = $api->get("activities/748612620");
print_ridemap($aride);
echo '<hr>';

// Get friends' rides:
$friend_rides = $api->get("activities/following", ['per_page' => 5, 'page' => 1]);
foreach ($friend_rides as $fride) {
	print_ride_details($fride);
	echo "<script type='text/javascript'>
			heatmap.addPolyLine('" . $fride->map->summary_polyline . "', " . $fride->id . ");
		 </script>";
	echo '<hr>';
}


include('footer.inc.php');