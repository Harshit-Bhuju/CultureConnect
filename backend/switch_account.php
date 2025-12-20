<?php
include("session_helper.php");
include("header.php");

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["status" => "error", "message" => "Invalid request"]);
    exit;
}

$target_email = strtolower(trim($_POST['account_email'] ?? ''));
$device_id = getDeviceId(); // Get from cookie

if (!$target_email) {
    echo json_encode(["status" => "error", "message" => "Missing account email"]);
    exit;
}

// Verify account is saved on THIS device
$stmt = $conn->prepare("SELECT saved_email FROM saved_accounts_device WHERE device_id = ? AND saved_email = ? LIMIT 1");
$stmt->bind_param("ss", $device_id, $target_email);
$stmt->execute();
$result = $stmt->get_result();
$stmt->close();

if ($result->num_rows === 0) {
    echo json_encode(["status" => "error", "message" => "Account not found on this device"]);
    exit;
}

// Get user data
$stmt = $conn->prepare("
    SELECT u.email, u.username, u.profile_pic, u.gender, u.province, u.district, u.municipality, u.ward, u.role,
           s.id AS seller_id
    FROM users u
    LEFT JOIN sellers s ON u.id = s.user_id
    WHERE u.email = ? 
    LIMIT 1
");
$stmt->bind_param("s", $target_email);
$stmt->execute();
$row = $stmt->get_result()->fetch_assoc();
$stmt->close();

if (!$row) {
    echo json_encode(["status" => "error", "message" => "User not found"]);
    exit;
}

// Switch session to new account
session_regenerate_id(true);
$_SESSION['user_email'] = $row['email'];
$_SESSION['logged_in'] = true;

echo json_encode([
    "status" => "success",
    "message" => "Switched account successfully",
    "user" => [
        "email" => $row['email'],
        "name" => $row['username'],
        "avatar" => $row['profile_pic'],
        "gender" => $row['gender'],
        "location" => [
            "province" => $row['province'],
            "district" => $row['district'],
            "municipality" => $row['municipality'],
            "ward" => $row['ward']
        ],
        "role" => $row['role'],
        "seller_id" => $row['seller_id'] ?? null,
        "teacher_id" => null
    ]
]);

$conn->close();
exit;