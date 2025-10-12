<?php
session_start();
include("session_helper.php");
include("header.php");

if (!checkSessionTimeout()) {
    echo json_encode([
        "status" => "error",
        "message" => "Session expired",
        "logged_in" => false
    ]);
    exit;
}

// Check pending sessions for set password flow (Google login)
if (isset($_SESSION['google_email'])) {
    echo json_encode([
        "status" => "pending_set_password",
        "logged_in" => false,
        "pending" => "google_email",
        "user" => [
            "email" => $_SESSION['google_email']
        ]
    ]);
    exit;
}

// Check pending sessions for forgot password flow
if (isset($_SESSION['forgot_email'])) {
    echo json_encode([
        "status" => "pending_change_password",
        "logged_in" => false,
        "pending" => "forgot_email",
        "otpEmail" => $_SESSION['forgot_email'],
        "user" => ["email" => $_SESSION['forgot_email']]
    ]);
    exit;
}

// Check pending sessions for signup verification flow
if (isset($_SESSION['pending_email'])) {
    echo json_encode([
        "status" => "pending_verification",
        "logged_in" => false,
        "pending" => "pending_email",
        "otpEmail" => $_SESSION['pending_email'],
        "user" => ["email" => $_SESSION['pending_email']]
    ]);
    exit;
}

// Normal authentication check
if (isAuthenticated()) {
    $stmt = $conn->prepare("SELECT * FROM users WHERE email = ? LIMIT 1");
    $stmt->bind_param("s", $_SESSION['user_email']);
    $stmt->execute();
    $result = $stmt->get_result();
    $row = $result->fetch_assoc();
    $stmt->close();

    if ($row) {
        // User exists in DB
        echo json_encode([
            "status" => "success",
            "logged_in" => true,
            "user" => [
                "email" => $row['email'] ?? '',
                "name" => $row['username'] ?? '',
                "gender" => $row['gender'] ?? '',
                "location" => $row['location'] ?? '',
                "picture" => $row['profile_pic'] ?? ''
            ]
        ]);
    } else {
        session_unset();
        session_destroy();
        echo json_encode([
            "status" => "error",
            "logged_in" => false,
            "message" => "User not found"
        ]);
    }
} else {
    echo json_encode([
        "status" => "error",
        "logged_in" => false,
        "message" => "Not authenticated"
    ]);
}
$conn->close();
exit;
