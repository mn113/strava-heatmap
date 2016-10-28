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

// Get me:
$me = $api->get("athlete");

// Start HTML:
?>
<?php include('templates/header.inc.php'); ?>
<script>
	var me = <?= json_encode($me); ?>;
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
