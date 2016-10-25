<?php
// Initialise debug console:
require_once(__DIR__ . '/vendor/php-console/php-console/src/PhpConsole/__autoload.php');
$connector = PhpConsole\Connector::getInstance();
$handler = PhpConsole\Handler::getInstance();
$isActiveClient = $connector->isActiveClient();
PhpConsole\Helper::register();

require_once('config.inc.php');
require_once('strava-master/StravaApi.php');

// Initialise API caller:
$api = new Iamstuartwilson\StravaApi(
	$clientId,
	$clientSecret
);
$api->setAccessToken($accessToken);


require('Collection.php');


// Test Collection class:
$me = $api->get("athlete");
$club_rides = $api->get("clubs/10360/activities", ['per_page' => 30, 'page' => 1]);
$friend_rides = $api->get("activities/following", ['per_page' => 30, 'page' => 1]);

$col = new StravaCollection($friend_rides);

var_dump($col->filter_by_date_range(5));
