<?php
include "dbconnect.php";
function generateSignupUsername($email, $conn)
{
    // take first part of email and sanitize
    $base = strtolower(explode('@', $email)[0]);
    $base = strtolower(preg_replace('/[^a-z]/', '', $base));

    $maxAttempts = 100; // large number to reduce chance of collision

    do {
        $maxAttempts--;
        // Generate different patterns
        $patterns = [
            $base . random_int(1, 999),                    // example12
            $base . '_' . random_int(1, 999),              // example_45
            $base . '.' . random_int(1, 999),              // example.78
            $base . random_int(1, 999) . '_',              // example23_
            $base . random_int(1, 999) . '.',              // example56.
            $base . '_' . random_int(1, 999) . '.',        // example_12.
            $base . '.' . random_int(1, 999) . '_',        // example.34_
            $base . random_int(1, 999),                    // example89
            $base . '_' . random_int(10, 99) . '_' . random_int(1, 9),  // example_12_3
            $base . '.' . random_int(10, 99) . '.' . random_int(1, 9),  // example.45.6
            $base . random_int(1, 9) . '.' . random_int(10, 99) . '_',  // example1.23_
            $base . '_' . random_int(1, 9) . '.' . random_int(100, 999), // example_3.456
            $base . random_int(10, 99) . '_',                              // example12_
            $base . random_int(100, 999) . '.',                             // example123.
            substr($base, 0, 3) . random_int(1, 999),      // exa12
            substr($base, 0, 3) . '_' . random_int(1, 999), // exa_34
            substr($base, 0, 3) . '.' . random_int(1, 999), // exa.56
            substr($base, 0, 4) . '_' . random_int(100, 999) . '.',    // exam_123.
            substr($base, 0, 2) . random_int(1, 9) . '_' . random_int(10, 99), // ex1_45
            substr($base, 0, 3) . '_' . random_int(1, 9) . '.',           // exa_7.
            // substr() means “substring”.
            // It takes a part of a string.
            // Parameters:
            // $base → the original string
            // 0 → start from index 0 (the beginning)
            // 3 → take 3 characters
        ];

        $candidate = $patterns[array_rand($patterns)];
        // array_rand($patterns) → picks a random index (0–2) 
        // means like array ma 0,2,3 xa bhane random ma linxa yauta index
        // $candidate → one of those generated usernames

        $available = isUsernameAvailable($candidate, $conn);
    } while (!$available && $maxAttempts > 0);

    // if somehow all attempts fail (extremely unlikely), keep increasing the number
    while (!$available) {
        $candidate = $base . '_' . (random_int(1000, 99999)); // larger number
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
