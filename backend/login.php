<?php
session_start();
include("header.php");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $email = strtolower(trim(filter_input(INPUT_POST, "email", FILTER_SANITIZE_EMAIL)));
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(["status" => "error", "message" => "Invalid email format."]);
        exit;
    }

    $password = trim($_POST['password']);

    // Prepare statement to prevent SQL injection
    $stmt = $conn->prepare("SELECT * FROM users WHERE email = ? LIMIT 1");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows !== 1) {
        $stmt->close();
        echo json_encode(["status" => "error", "message" => "User not found or not verified."]);
        exit;
    }

    $user = $result->fetch_assoc();
    $stmt->close();

    // Verify password
    if (!password_verify($password, $user['password'])) {
        echo json_encode(["status" => "error", "message" => "Incorrect password."]);
        exit;
    }

    $_SESSION['user_email'] = $user['email'];
    $_SESSION['logged_in'] = true;
    $_SESSION['last_activity'] = time();

    echo json_encode([
        "status" => "success",
        "message" => "Login successful.",
        "user" => [
            "email" => $user['email'],
            "name" => $user['username'] ?? '',
            "gender" => $user['gender'] ?? '',
            "location" => $user['location'] ?? '',
            "avatar" => $user['profile_pic'] ?? '',
            "role" => $user['role'] 
        ]
    ]);
    exit;
}

echo json_encode(["status" => "error", "message" => "Invalid request."]);

$conn->close();
exit;
