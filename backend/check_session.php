<?php
include("session_helper.php");
include("header.php");

if (!checkSessionTimeout()) {
    echo json_encode([
        "status" => "error",
        "message" => "Session expired",
        "logged_in" => false,
        "accounts" => []
    ]);
    exit;
}

$current_user_email = $_SESSION['user_email'] ?? null;
$device_id = getDeviceId();

$savedAccounts = [];
$stmt = $conn->prepare("
    SELECT u.email, u.username, u.profile_pic, u.gender, u.province, u.district, u.municipality, u.ward, u.role
    FROM saved_accounts_device sa
    JOIN users u ON sa.saved_email = u.email
    WHERE sa.device_id = ? AND u.role != 'admin'
    ORDER BY sa.id DESC
");
$stmt->bind_param("s", $device_id);
$stmt->execute();
$result = $stmt->get_result();
while ($row = $result->fetch_assoc()) {
    $savedAccounts[] = [
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
        "role" => $row['role']
    ];
}
$stmt->close();

$current_user_data = null;
if ($current_user_email) {
    $stmt = $conn->prepare("SELECT email, username, profile_pic, gender, province, district, municipality, ward, role FROM users WHERE email=? LIMIT 1");
    $stmt->bind_param("s", $current_user_email);
    $stmt->execute();
    $row = $stmt->get_result()->fetch_assoc();
    $stmt->close();

    if ($row) {
        $current_user_data = [
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
            "role" => $row['role']
        ];
    }
}

echo json_encode([
    "status" => "success",
    "logged_in" => !!$current_user_data,
    "user" => $current_user_data,
    "accounts" => $savedAccounts
]);

$conn->close();
exit;
