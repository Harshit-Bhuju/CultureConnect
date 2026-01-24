<?php
require_once __DIR__ . '/../config/session_config.php';
include("../config/header.php");

// Check authentication
if (!isset($_SESSION['user_email'])) {
    echo json_encode(["success" => false, "message" => "Not authenticated"]);
    exit;
}

$user_email = $_SESSION['user_email'];

// Verify admin role
$stmt = $conn->prepare("SELECT role FROM users WHERE email = ? LIMIT 1");
$stmt->bind_param("s", $user_email);
$stmt->execute();
$user = $stmt->get_result()->fetch_assoc();
$stmt->close();

if (!$user || $user['role'] !== 'admin') {
    echo json_encode(["success" => false, "message" => "Unauthorized access"]);
    exit;
}

$type = $_GET['type'] ?? 'all'; // all, users, experts, sellers

$query = "";
$params = [];
$types = "";

$query = "SELECT id, username as name, email, role, profile_pic as avatar, created_at FROM users WHERE role != 'admin' ORDER BY created_at DESC LIMIT 20";

$stmt = $conn->prepare($query);
if (!$stmt) {
    echo json_encode(["success" => false, "message" => "Prepare failed: " . $conn->error]);
    exit;
}

if (!$stmt->execute()) {
    echo json_encode(["success" => false, "message" => "Execute failed: " . $stmt->error]);
    exit;
}

$result = $stmt->get_result();
$data = $result->fetch_all(MYSQLI_ASSOC);

echo json_encode([
    "success" => true,
    "data" => $data
]);

$conn->close();
