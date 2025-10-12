<?php
session_start();
include("header.php");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $email = strtolower(trim(filter_input(INPUT_POST, "email", FILTER_SANITIZE_EMAIL)));
    $picture = trim($_POST['picture'] ?? '');

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(["status" => "error", "message" => "Invalid email format."]);
        exit;
    }

    $stmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    $userData = ["email" => $email, "picture" => $picture];

    if ($result->num_rows === 0) {
        // New user - insert
        $stmt = $conn->prepare("SELECT * FROM pending_users WHERE email = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $resultPending = $stmt->get_result();

        if ($resultPending->num_rows === 0) {
            $stmt = $conn->prepare("INSERT INTO pending_users (email,profile_pic) VALUES (?,?)");
            $stmt->bind_param("ss", $email, $picture);
            $stmt->execute();
        }

        $password = null;
    } else {
        // Existing user
        $row = $result->fetch_assoc();
        $password = $row['password'];
        $userData = [
            "email" => $row['email'],
            "name" => $row['username'],
            "gender" => $row['gender'],
            "location" => $row['location'],
            "picture" => $row['profile_pic']
            // If $picture from Google exists (is not empty), use that.
            //If $picture is empty or null, fall back to the 
            //existing profile_pic from the database.
        ];
    }
    $stmt->close();

    // Return response based on password
    if ($password === null || $password === '') {
        // Store email in SESSION for setpassword.php
        $_SESSION['google_email'] = $email;
        echo json_encode([
            "status" => "null",
            "user" => $userData
        ]);
    } else {
        $_SESSION['user_email'] = $email;
        $_SESSION['logged_in'] = true;
        $_SESSION['last_activity'] = time();

        echo json_encode([
            "status" => "not_null",
            "user" => $userData
        ]);
    }
}

$conn->close();
exit;
