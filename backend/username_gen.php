<?php
include "dbconnect.php";
function generateSignupUsername($email, $conn)
{
    // take first part of email and sanitize
    $base = strtolower(explode('@', $email)[0]);
    $base = strtolower(preg_replace('/[^a-z]/', '', $base));

    $maxAttempts = 1000; // large number to reduce chance of collision
    $attempts = 0;

    do {
        $attempts++;
   
        $candidate = $base . '_' . random_int(100, 99999);
        $available = isUsernameAvailable($candidate, $conn);
    } while (!$available && $attempts < $maxAttempts);

    // if somehow all attempts fail (extremely unlikely), keep increasing the number
    while (!$available) {
        $candidate = $base . (random_int(100000, 999999)); // larger number
        $available = isUsernameAvailable($candidate, $conn);
    }

    return $candidate;
}


function isUsernameAvailable($username, $conn)
{
    $stmt = $conn->prepare('SELECT * FROM users WHERE username = ?');
    $stmt->bind_param('s', $username);
    $stmt->execute();
    $result = $stmt->get_result();
    $row = $result->fetch_assoc();
    $stmt->close();
    return $row === null;
    //it will give true or false...., if there is no row it will 
    //give null so true otherwise if there is username will give false
}
