<?php
// Initialise debug console:
require_once(__DIR__ . '/vendor/php-console/php-console/src/PhpConsole/__autoload.php');
$connector = PhpConsole\Connector::getInstance();
$handler = PhpConsole\Handler::getInstance();
$handler->start(); // initialize handlers
$isActiveClient = $connector->isActiveClient();
PhpConsole\Helper::register();
//PC::debug($handler, "PC");

