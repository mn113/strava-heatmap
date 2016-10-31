<?php
// Check if user is already authorised:
if (isset($_COOKIE['access_token'])) {
    // Nothing to output here, return to parent page:
    $user_access_token = $_COOKIE['user_access_token'];
    die();
}

// First step of OAuth: make the user click through to https://www.strava.com/oauth/authorize
// and after they log in or accept, Strava will redirect them back... here:
if (!isset($_GET['code'])) {
    $url = $api->authenticationUrl(AUTH_REDIRECT_URI);
    // Do this bit as modal / closable div
    echo '<div class="modal-bg">';
    echo '<div class="modal-dialog">';
    echo '<p>To use this app, you need to log in to Strava.</p>';
    echo '<a href="' .$url .'" target="_blank"><button class="strava-ish">Authorise this app</button></a>';
    echo '<p><a onclick="$(".modal-dialog").hide();">Close</a></p>';
    echo '</div></div>';
    die();
}

// Second step of OAuth: token exchange
// Assuming the user logged in / authorised, the code returned can be used to set the API access tokem
else {
    $result = $api->tokenExchange($_GET['code']);
    // Now that the user has agreed to let the app know their data, the app can register itself with the API:
    $user_access_token = $api->setAccessToken($result->access_token);
    // Make the token last a while:
    setcookie('user_access_token', $user_access_token, time()+60*30, '/', 'localhost', false, false);

	// Do this bit as an unobtrusive popup:
    echo '<div class="popup-bar strava-ish autohide">';
    echo 'Connected to Strava as '. $result->athlete->firstname;
    echo '</div>';
}
