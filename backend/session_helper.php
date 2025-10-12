<?php

function checkSessionTimeout($timeout = 7*86400)
{
    if (isset($_SESSION['last_activity']) && (time() - $_SESSION['last_activity'] > $timeout)) {
        session_unset();
        session_destroy();
        return false;
    }
    $_SESSION['last_activity'] = time();
    return true;
}

// Helper function to check if user is authenticated
function isAuthenticated()
{
    return isset($_SESSION['logged_in']) && $_SESSION['logged_in'] === true && isset($_SESSION['user_email']);
}

