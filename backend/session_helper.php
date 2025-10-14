<?php
session_start();

function checkSessionTimeout($timeout = 7 * 86400)
{
    if (isset($_SESSION['last_activity']) && (time() - $_SESSION['last_activity'] > $timeout)) {
        session_unset();
        session_destroy();
        return false;
    }
    $_SESSION['last_activity'] = time();
    return true;
}
function isAuthenticated()
{
    return isset($_SESSION['user_email']) && checkSessionTimeout();
}

// Get or generate device_id cookie
function getDeviceId()
{
    if (!isset($_COOKIE['device_id'])) {
        $device_id = bin2hex(random_bytes(16));
        setcookie('device_id', $device_id, time() + (365 * 24 * 60 * 60), '/', '', false, true);
        $_COOKIE['device_id'] = $device_id;
    } else {
        $device_id = $_COOKIE['device_id'];
    }
    return $device_id;
}
