<?php
// Initialise debug console:
require_once(__DIR__ . '/vendor/php-console/php-console/src/PhpConsole/__autoload.php');
$connector = PhpConsole\Connector::getInstance();
$handler = PhpConsole\Handler::getInstance();
$isActiveClient = $connector->isActiveClient();
PhpConsole\Helper::register();

require_once('config.inc.php');
require_once('strava-master/StravaApi.php');
include_once('functions.inc.php');

// Initialise API caller:
$api = new Iamstuartwilson\StravaApi(
	$clientId,
	$clientSecret
);
$api->setAccessToken($accessToken);

// Get me:
$me = $api->get("athlete");

$club = $_POST['club'] || 10360;

// Start HTML:
include('templates/header.inc.php');

echo '<section id="main">';
	echo '<div id="map"></div>';
	include('templates/form.inc.php');
	echo '<footer>Footer</footer>';
echo '</section>';

echo '<section id="sidebar">';
	include('templates/lists.inc.php');	
echo '</section>';

include('templates/footer.inc.php');