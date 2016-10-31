<?php
include_once('debugger.inc.php');
require_once('config.inc.php');
require_once('StravaApi.php');
include_once('functions.inc.php');

// Initialise API caller:
$api = new Iamstuartwilson\StravaApi(
	CLIENT_ID,
	CLIENT_SECRET
);
$api->setAccessToken(PERSONAL_ACCESS_TOKEN);	// this authenticates app using MY personal account token (!)

// Get me:
$me = $api->get("athlete");

// Start HTML:
include_once('templates/header.inc.php');
// Auth:
include_once('templates/auth.inc.php');	// should overwrite MY access token with user's
?>

<script>
	var me = <?= json_encode($me); ?>; // unnecessary
</script>

<section id="main">
	<div id="map"></div>
	<?php include('templates/form.inc.php'); ?>
	<footer>Footer</footer>
</section>

<section id="sidebar" class="friends">
	<?php include('templates/lists.inc.php'); ?>
</section>

<?php include('templates/footer.inc.php'); ?>
