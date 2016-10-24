<?php
	// Initialise debug console:
$connector = \PhpConsole\Connector::getInstance();

require_once('strava-master/StravaApi.php');
include_once('functions.php');

// App-specific data:
$clientId = 14325;
$clientSecret = 'e35ef28fc1c6a843c2bda5e185440968de99f1dc';

// Initialise API caller:
$api = new Iamstuartwilson\StravaApi(
	$clientId,
	$clientSecret
);

//You will then need to authenticate your strava account by requesting an access code [1]. The account you register your app will give you an access token, so you can skip this step if you're just testing endpoints/methods. You can generate a URL for authentication using the following method:

//$api->authenticationUrl($redirect, $approvalPrompt = 'auto', $scope = null, $state = null);

//When a code is returned you must then exchange it for an access token for the authenticated user:

//$api->tokenExchange($code);

//Before making any requests you must set the access token as returned from your token exchange or via your own private token from Strava:

$accessToken = '1638809775d55c0e9aecf470e4352d89a19a74a5';
$api->setAccessToken($accessToken);
$gmaps_key = 'AIzaSyA3nqF6Dq6FDNY9PSFNffwd2IhfY068wuI';

// Start HTML:
include('header.php');


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


include('footer.php');