<?php
include("session_helper.php");
include("header.php");

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["status" => "error", "message" => "Invalid request"]);
    exit;
}

// Get the account email to save (either from POST or current session)
$account_to_save = trim($_POST['account_email'] ?? '');
$device_id = trim(getDeviceId());

if (!$account_to_save) {
    // Fall back to session if POST is empty
    $account_to_save = $_SESSION['user_email'] ?? '';
}

if (!$account_to_save) {
    echo json_encode(["status" => "error", "message" => "No account to save"]);
    exit;
}

try {
    // Check if the account exists and get user info including role
    $stmt = $conn->prepare("SELECT email, role FROM users WHERE email=? LIMIT 1");
    $stmt->bind_param("s", $account_to_save);
    $stmt->execute();
    $result = $stmt->get_result();
    $user_exists = $result->num_rows > 0;
    $user_data = $result->fetch_assoc();
    $stmt->close();

    if (!$user_exists) {
        // If the user does not exist yet (first-time Google login), create user placeholder
        $stmt = $conn->prepare("INSERT INTO users (email) VALUES (?)");
        $stmt->bind_param("s", $account_to_save);
        $stmt->execute();
        $stmt->close();
    } else {
        // Check if user is admin
        if (isset($user_data['role']) && $user_data['role'] === 'admin') {
            echo json_encode([
                "status" => "error",
                "message" => "Admin accounts cannot be saved",
                "saved_email" => $account_to_save
            ]);
            exit;
        }
    }

    // Check if account is already saved for this device
    $stmt = $conn->prepare("SELECT id FROM saved_accounts_device WHERE device_id=? AND saved_email=? LIMIT 1");
    $stmt->bind_param("ss", $device_id, $account_to_save);
    $stmt->execute();
    $result = $stmt->get_result();
    $exists = $result->num_rows > 0;
    $stmt->close();

    if (!$exists) {
        // Save the account
        $stmt = $conn->prepare("INSERT INTO saved_accounts_device (device_id, saved_email) VALUES (?, ?)");
        $stmt->bind_param("ss", $device_id, $account_to_save);
        $stmt->execute();
        $stmt->close();
        
        echo json_encode([
            "status" => "success",
            "message" => "Account saved",
            "saved_email" => $account_to_save
        ]);
    } else {
        echo json_encode([
            "status" => "exists",
            "message" => "Account already saved",
            "saved_email" => $account_to_save
        ]);
    }
} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}

$conn->close();
exit;