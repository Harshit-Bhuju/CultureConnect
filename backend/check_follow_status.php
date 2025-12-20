<?php
session_start();
include("header.php");


if (!isset($_SESSION['user_email'])) {
    echo json_encode(["status" => "error", "message" => "User not logged in"]);
    exit;
}

$seller_id = isset($_GET['seller_id']) ? intval($_GET['seller_id']) : null;

if (!$seller_id) {
    echo json_encode(["status" => "error", "message" => "Seller ID not provided"]);
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
    echo json_encode(["status" => "error", "message" => "User not found"]);
    exit;
}

$user_id = $user['id'];

// Check if following
$stmt = $conn->prepare("SELECT id FROM seller_followers WHERE user_id = ? AND seller_id = ? LIMIT 1");
$stmt->bind_param("ii", $user_id, $seller_id);
$stmt->execute();
$result = $stmt->get_result();
$is_following = $result->num_rows > 0;
$stmt->close();

echo json_encode([
    "status" => "success",
    "is_following" => $is_following
]);

$conn->close();
exit;
