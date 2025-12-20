<?php
include("session_helper.php");
include("header.php");

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["status" => "error", "message" => "Invalid request"]);
    exit;
}

$account_to_save = strtolower(trim($_POST['account_email'] ?? ''));
$device_id = getDeviceId(); // Get from cookie

if (!$account_to_save) {
    echo json_encode(["status" => "error", "message" => "No account to save"]);
    exit;
}

try {
    // Check if user exists
    $stmt = $conn->prepare("SELECT email, role FROM users WHERE email = ? LIMIT 1");
    $stmt->bind_param("s", $account_to_save);
    $stmt->execute();
    $result = $stmt->get_result();
    $user_data = $result->fetch_assoc();
    $stmt->close();

    if (!$user_data) {
        echo json_encode(["status" => "error", "message" => "User not found"]);
        exit;
    }

    // Block admin accounts
    if ($user_data['role'] === 'admin') {
        echo json_encode([
            "status" => "error",
            "message" => "Admin accounts cannot be saved"
        ]);
        exit;
    }

    // Check if already saved on THIS device
    $stmt = $conn->prepare("SELECT id FROM saved_accounts_device WHERE device_id = ? AND saved_email = ? LIMIT 1");
    $stmt->bind_param("ss", $device_id, $account_to_save);
    $stmt->execute();
    $result = $stmt->get_result();
    $exists = $result->num_rows > 0;
    $stmt->close();

    if (!$exists) {
        // Save account to THIS device
        $stmt = $conn->prepare("INSERT INTO saved_accounts_device (device_id, saved_email) VALUES (?, ?)");
        $stmt->bind_param("ss", $device_id, $account_to_save);
        $stmt->execute();
        $stmt->close();
        
        echo json_encode([
            "status" => "success",
            "message" => "Account saved to this device",
            "saved_email" => $account_to_save
        ]);
    } else {
        echo json_encode([
            "status" => "exists",
            "message" => "Account already saved on this device",
            "saved_email" => $account_to_save
        ]);
    }
} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}

$conn->close();
exit;