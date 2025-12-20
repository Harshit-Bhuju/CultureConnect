<?php
session_start();
include("header.php");

if (!isset($_SESSION['user_email'])) {
    echo json_encode([
        "status" => "success",
        "is_following" => false,
        "message" => "User not logged in"
    ]);
    exit;
}

$user_email = $_SESSION['user_email'];

// Get user_id from email
$stmt = $conn->prepare("SELECT id FROM users WHERE email = ? LIMIT 1");
$stmt->bind_param("s", $user_email);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();
$stmt->close();

if (!$user) {
    echo json_encode([
        "status" => "error",
        "message" => "User not found"
    ]);
    exit;
}

$user_id = $user['id'];

// Get teacher_id from URL parameter
$teacher_id = isset($_GET['teacher_id']) ? intval($_GET['teacher_id']) : 0;

if (!$teacher_id) {
    echo json_encode([
        "status" => "error",
        "message" => "Teacher ID not provided"
    ]);
    exit;
}

// Check if following
$check_stmt = $conn->prepare("
    SELECT id 
    FROM teacher_followers 
    WHERE teacher_id = ? AND follower_user_id = ? 
    LIMIT 1
");
$check_stmt->bind_param("ii", $teacher_id, $user_id);
$check_stmt->execute();
$check_result = $check_stmt->get_result();
$is_following = $check_result->num_rows > 0;
$check_stmt->close();

echo json_encode([
    "status" => "success",
    "is_following" => $is_following
]);

$conn->close();
exit;