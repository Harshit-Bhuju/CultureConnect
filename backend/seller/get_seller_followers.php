<?php
require_once __DIR__ . '/../config/session_config.php';
include("../config/header.php");

// Debug: Log all headers (optional)
// error_log(print_r(getallheaders(), true));

// 1. Get seller_id from GET request
$seller_id = isset($_GET['seller_id']) ? intval($_GET['seller_id']) : 0;

if ($seller_id <= 0) {
    echo json_encode(["status" => "error", "message" => "Invalid seller ID"]);
    exit;
}

// 2. Query to fetch followers
// We join seller_followers with users table to get follower details
$query = "
    SELECT 
        u.id AS user_id,
        u.username,
        u.profile_pic,
        sf.created_at AS followed_at
    FROM seller_followers sf
    INNER JOIN users u ON sf.user_id = u.id
    WHERE sf.seller_id = ?
    ORDER BY sf.created_at DESC
";

$stmt = $conn->prepare($query);
if (!$stmt) {
    echo json_encode(["status" => "error", "message" => "Database error: " . $conn->error]);
    exit;
}

$stmt->bind_param("i", $seller_id);
$stmt->execute();
$result = $stmt->get_result();

$followers = [];
while ($row = $result->fetch_assoc()) {
    $followers[] = [
        "user_id" => $row['user_id'],
        "username" => $row['username'],
        "profile_pic" => $row['profile_pic'],
        "followed_at" => $row['followed_at']
    ];
}

$stmt->close();
$conn->close();

// 3. Return JSON response
echo json_encode([
    "status" => "success",
    "followers" => $followers,
    "count" => count($followers)
]);
exit;
