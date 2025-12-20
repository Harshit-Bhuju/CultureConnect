<?php
include("session_helper.php");
include("header.php");

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["status" => "error", "message" => "Invalid request"]);
    exit;
}

$account_email = strtolower(trim(filter_input(INPUT_POST, "account_email", FILTER_SANITIZE_EMAIL)));
$device_id = getDeviceId(); // Get from cookie

if (empty($account_email)) {
    echo json_encode(["status" => "error", "message" => "Account email is required"]);
    exit;
}

// Delete the account from THIS device only
$stmt = $conn->prepare("DELETE FROM saved_accounts_device WHERE device_id = ? AND saved_email = ?");
$stmt->bind_param("ss", $device_id, $account_email);
$stmt->execute();
$affected_rows = $stmt->affected_rows;
$stmt->close();

if ($affected_rows > 0) {
    echo json_encode([
        "status" => "success",
        "message" => "Account removed from this device"
    ]);
} else {
    echo json_encode([
        "status" => "error",
        "message" => "Account not found on this device"
    ]);
}

$conn->close();
exit;