<?php
session_start();
include("header.php");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $account_email = strtolower(trim(filter_input(INPUT_POST, "account_email", FILTER_SANITIZE_EMAIL)));
    $current_user_email = $_SESSION['user_email'] ?? '';

    if (empty($account_email)) {
        echo json_encode([
            "status" => "error",
            "message" => "Account email is required"
        ]);
        exit;
    }

    if (!$current_user_email) {
        echo json_encode([
            "status" => "error",
            "message" => "Not logged in"
        ]);
        exit;
    }

    // Get device_id from current user
    $stmt = $conn->prepare("SELECT device_id FROM saved_accounts_device WHERE saved_email = ? LIMIT 1");
    $stmt->bind_param("s", $current_user_email);
    $stmt->execute();
    $result = $stmt->get_result();
    $row = $result->fetch_assoc();
    $stmt->close();

    $device_id = $row['device_id'] ?? '';

    if (!$device_id) {
        echo json_encode([
            "status" => "error",
            "message" => "Device not found"
        ]);
        exit;
    }

    // Delete the account from this device
    $stmt = $conn->prepare("DELETE FROM saved_accounts_device WHERE device_id = ? AND saved_email = ?");
    $stmt->bind_param("ss", $device_id, $account_email);
    $stmt->execute();
    $affected_rows = $stmt->affected_rows;
    $stmt->close();

    if ($affected_rows > 0) {
        echo json_encode([
            "status" => "success",
            "message" => "Account removed successfully"
        ]);
    } else {
        echo json_encode([
            "status" => "error",
            "message" => "Account not found on this device"
        ]);
    }
}
$conn->close();
exit;