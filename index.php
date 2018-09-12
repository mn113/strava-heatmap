<?php
//include_once('debugger.inc.php');
require_once('config.inc.php');
require_once('StravaApi.php');
include_once('functions.inc.php');

// Initialise API caller:
$api = new Iamstuartwilson\StravaApi(
	CLIENT_ID,
	CLIENT_SECRET
);
$api->setAccessToken(PERSONAL_ACCESS_TOKEN);	// this authenticates app using MY personal account token (!)

// Auth:
include_once('templates/auth.inc.php');		// should overwrite MY access token with user's
// $mode is now set
// Start HTML:
include_once('templates/header.inc.php');	// <body> tag now open

if ($mode == 'logged') {
	// Do this bit as an unobtrusive popup:
    echo '<div class="popup-bar strava-ish autohide">';
    echo 'Connected to Strava as '. $result->athlete->firstname;
    echo '</div>';
}
else if ($mode == 'demo') {
	// Do this bit as modal / closable div
    echo '<div class="modal-bg">';
    echo '<div class="modal-dialog">';
    echo '<p>In 2018, Strava have changed their API, severely crippling third-party apps like this one. I now can\'t display your friends\' rides at all.</p>';
    echo '<p>To use this app fully, you need to log in to Strava.</p>';
    echo '<a href="' .$authUrl .'"><button class="strava-ish">Authorise this app</button></a>';
    echo '<p><a href="#">Close and use default profile</a></p>';
    echo '</div></div>';
}

// Get current user & pass to javascript:
$user = $api->get("athlete");
echo '<script>var user = '. json_encode($user) .', mode = "'. $mode .'";</script>';
?>

<section id="main">
	<div id="map"></div>
	<?php include('templates/form.inc.php'); ?>
	<?php if (!isset($_COOKIE['okCookies']) || $_COOKIE['okCookies'] !== 'true'): ?>
		<div class="cookie-message">This site uses cookies to remember you. <a href="#">[OK]</a></div>
	<?php endif ?>
	<footer>
		Created in 2016 by
		<a target="_blank" href="https://github.com/mn113">mn113</a> using
		<a target="_blank" href="https://www.strava.com/">Strava</a> API v3,
		<a target="_blank" href="https://github.com/iamstuartwilson/strava">PHP wrapper</a>,
		<a target="_blank" href="http://leafletjs.com/">Leaflet</a>, &amp;
		<a target="_blank" href="http://zeptojs.com/">ZeptoJS</a>.
	</footer>
</section>

<section id="sidebar" class="friends">
	<?php include('templates/lists.inc.php'); ?>
</section>

<?php include('templates/footer.inc.php'); ?>
