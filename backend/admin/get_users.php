<?php
require_once __DIR__ . '/../config/session_config.php';
include("../config/header.php");

// Check if user is admin
if (!isset($_SESSION['user_email'])) {
    echo json_encode(["success" => false, "message" => "Not authenticated"]);
    exit;
}

$user_email = $_SESSION['user_email'];

// Verify admin role
$stmt = $conn->prepare("SELECT role FROM users WHERE email = ? LIMIT 1");
$stmt->bind_param("s", $user_email);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();
$stmt->close();

if (!$user || $user['role'] !== 'admin') {
    echo json_encode(["success" => false, "message" => "Unauthorized access"]);
    exit;
}

$sql = "SELECT id, username as name, email, role, profile_pic, 
               CASE WHEN role = 'admin' THEN 'active' ELSE 'active' END as status, 
               created_at as joinDate 
        FROM users 
        WHERE role != 'admin'
        ORDER BY created_at DESC";

$result = $conn->query($sql);
$users = [];

while ($row = $result->fetch_assoc()) {
    // Format role
    if ($row['role'] === 'seller_teacher') {
        $row['role'] = 'Seller and Teacher';
    } else {
        $row['role'] = ucfirst($row['role']);
    }

    // Add dummy activity stats for now as they require complex joins
    $row['totalPurchases'] = 0; // Will be updated if we implement full history
    $row['totalSpent'] = "Rs. 0";

    $users[] = $row;
}

echo json_encode(["success" => true, "users" => $users]);

$conn->close();
