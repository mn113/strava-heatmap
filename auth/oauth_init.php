<?php
require_once('../config.inc.php');
require_once('../strava-master/StravaApi.php');

// Initialise API caller:
$api = new Iamstuartwilson\StravaApi(
	$clientId,
	$clientSecret
);

// First step of OAuth: make the user click through to https://www.strava.com/oauth/authorize
// and after they log in or accept, Strava will redirect them back... here:
$redirect_uri = 'http://localhost:8888/2016/strava-heatmap/auth/oauth_init.php';

if (!isset($_GET['code'])) {
    $url = $api->authenticationUrl($redirect_uri);
    echo '<a href="' .$url .'" target="_blank"><img src="images/strava.png" alt="Authenticate"></a>';
}

// Second step of OAuth: token exchange

else {
    $result = $api->tokenExchange($_GET['code']);
    // Now that the user has agreed to let the app know their data, the app can register itself with the API:
    $token = $api->setAccessToken($result->access_token);

    include_once('../templates/header.inc.php');
    echo '<h5></h5>Successfully connected to Strava</h5>';
    echo '<img src="' .$result->athlete->profile .'">';
}
