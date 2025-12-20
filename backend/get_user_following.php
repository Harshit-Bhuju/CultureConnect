<?php
session_start();
include("header.php");


// Check if user is logged in
if (!isset($_SESSION['user_email'])) {
    echo json_encode(["status" => "error", "message" => "User not logged in"]);
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

// Get all sellers the user is following
$query = "
    SELECT 
        s.id as seller_id,
        s.store_name,
        s.store_logo,
        s.store_description,
        s.primary_category,
        s.followers,
        sf.created_at as followed_at
    FROM seller_followers sf
    INNER JOIN sellers s ON sf.seller_id = s.id
    WHERE sf.user_id = ?
    ORDER BY sf.created_at DESC
";



$stmt = $conn->prepare($query);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

$following = [];
while ($row = $result->fetch_assoc()) {

    $following[] = [
        "seller_id" => $row['seller_id'],
        "store_name" => $row['store_name'],
        "store_logo" => $row['store_logo'],
        "category" => $row['primary_category'],
        "followers" => (int)$row['followers'],
        "followed_at" => $row['followed_at'],
        "is_following" => true
    ];
}

$stmt->close();

echo json_encode([
    "status" => "success",
    "following" => $following,
]);

$conn->close();
exit;
