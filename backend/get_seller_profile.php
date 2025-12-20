<?php
session_start();
include("header.php");


$seller_id = isset($_GET['seller_id']) ? intval($_GET['seller_id']) : null;

if (!$seller_id) {
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

    // Get seller_id from user_id
    $stmt = $conn->prepare("SELECT id FROM sellers WHERE user_id = ? LIMIT 1");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $seller = $result->fetch_assoc();
    $stmt->close();

    if ($seller) {
        $seller_id = $seller['id'];
    }
}

if (!$seller_id) {
    echo json_encode(["status" => "error", "message" => "Seller ID not provided"]);
    exit;
}

//  Fetch seller by ID
$stmt = $conn->prepare("SELECT * FROM sellers WHERE id = ? LIMIT 1");
$stmt->bind_param("i", $seller_id);
$stmt->execute();
$result = $stmt->get_result();
$seller_profile = $result->fetch_assoc();
$stmt->close();
$created_at = $seller_profile["created_at"];
$formatted_created_at = date("j F Y", strtotime($created_at));
if ($seller_profile) {
    echo json_encode([
        "status" => "success",
        "seller_profile" => [
            "seller_id" => $seller_profile["id"],
            "name" => $seller_profile["store_name"],
            "description" => $seller_profile["store_description"],
            "category" => $seller_profile["primary_category"],
            "esewa_phone" => $seller_profile["esewa_phone"],
            "location" => [
                "province" => $seller_profile['province'] ?? '',
                "district" => $seller_profile['district'] ?? '',
                "municipality" => $seller_profile['municipality'] ?? '',
                "ward" => $seller_profile['ward'] ?? ''
            ],
            "store_logo" => $seller_profile["store_logo"],
            "store_banner" => $seller_profile["store_banner"],
            "followers_count" => $seller_profile["followers"] ?? 0,
            "created_at" => $formatted_created_at
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
