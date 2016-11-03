<?php
// Check if user is already authorised:
if (isset($_COOKIE['access_token'])) {
    // Nothing to output here, return to parent page:
    $user_access_token = $_COOKIE['user_access_token'];
    $api->setAccessToken($user_access_token);
    $mode = 'logged';
    return;
}
else {
    // First step of OAuth: make the user click through to https://www.strava.com/oauth/authorize
    // and after they log in or accept, Strava will redirect them back... here:
    if (!isset($_GET['code'])) {
        // No authorisation until we visit authUrl and get code back
        $authUrl = $api->authenticationUrl(AUTH_REDIRECT_URI);
        // Need to let non-Strava users use the app in demo mode:
        $mode = 'demo';
    }

    // Second step of OAuth: token exchange
    // Assuming the user logged in / authorised, the code returned can be used to set the API access tokem
    else {
        $result = $api->tokenExchange($_GET['code']);
        // Now that the user has agreed to let the app know their data, the app can register itself with the API:
        $user_access_token = $api->setAccessToken($result->access_token);
        // Make the token last a while:
        setcookie('user_access_token', $user_access_token, time()+60*60, '/', DOMAIN, false, false);
        $mode = 'logged';
    }

    return;
}
