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

    // Use LEFT JOIN to get seller_id and teacher_id in one query
    $stmt = $conn->prepare("
        SELECT 
            u.*, 
            s.id AS seller_id
        FROM users u
        LEFT JOIN sellers s ON u.id = s.user_id
        WHERE u.email = ? 
        LIMIT 1
    ");
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

    if (!password_verify($password, $user['password'])) {
        echo json_encode(["status" => "error", "message" => "Incorrect password."]);
        exit;
    }

    // Set session
    $_SESSION['user_email'] = $user['email'];
    $_SESSION['logged_in'] = true;

    echo json_encode([
        "status" => "success",
        "message" => "Login successful.",
        "user" => [
            "email" => $user['email'],
            "name" => $user['username'] ?? '',
            "gender" => $user['gender'] ?? '',
            "location" => [
                "province" => $user['province'] ?? '',
                "district" => $user['district'] ?? '',
                "municipality" => $user['municipality'] ?? '',
                "ward" => $user['ward'] ?? ''
            ],
            "avatar" => $user['profile_pic'] ?? '',
            "role" => $user['role'],
            "seller_id" => $user['seller_id'] ?? null,
            "teacher_id" => null
        ]
    ]);
    exit;
}

echo json_encode(["status" => "error", "message" => "Invalid request."]);
$conn->close();
exit;
