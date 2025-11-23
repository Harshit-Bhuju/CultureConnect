<?php
session_start();
include("header.php");
if (!isset($_SESSION['user_email'])) {
    echo json_encode(["status" => "error", "message" => "User not logged in"]);
    exit;
}
$user_email = $_SESSION['user_email'];

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


$stmt = $conn->prepare("SELECT * FROM sellers WHERE user_id = ?");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();
$seller_profile = $result->fetch_assoc();
$stmt->close();
if ($seller_profile) {
    echo json_encode([
        "status" => "success",
        "seller_profile" => [
            "seller_id" => $seller_profile["id"],
            "name" => $seller_profile["store_name"],
            "email" => $seller_profile["store_email"],
            "category" => $seller_profile["primary_category"],
            "description" => $seller_profile["store_description"],
            "store_logo" => $seller_profile["store_logo"],
            "store_banner" => $seller_profile["store_banner"]
        ]
    ]);
} else {
    echo json_encode([
        "status" => "error",
        "message" => "Seller profile not found"
    ]);
}
$conn->close();
exit;