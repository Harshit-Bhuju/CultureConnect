<?php
session_start();
include("header.php");

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $current_user_email = $_SESSION['user_email'] ?? '';
    
    // Get device_id for current user
    $stmt = $conn->prepare("SELECT device_id FROM saved_accounts_device WHERE saved_email = ? LIMIT 1");
    $stmt->bind_param("s", $current_user_email);
    $stmt->execute();
    $result = $stmt->get_result();
    $row = $result->fetch_assoc();
    $stmt->close();
    
    $device_id = $row['device_id'] ?? '';
    
    if (!$device_id) {
        // No device_id means this is first login, return empty accounts
        echo json_encode([
            "status" => "success",
            "accounts" => []
        ]);
        exit;
    }
    
    // Get all saved accounts for this device (excluding current user AND admin accounts)
    $stmt = $conn->prepare("
        SELECT DISTINCT u.email, u.username, u.profile_pic, u.role
        FROM saved_accounts_device sa
        JOIN users u ON sa.saved_email = u.email
        WHERE sa.device_id = ? 
          AND sa.saved_email != ?
          AND u.role != 'admin'
        ORDER BY sa.created_at DESC
    ");
    $stmt->bind_param("ss", $device_id, $current_user_email);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $accounts = [];
    while ($row = $result->fetch_assoc()) {
        $accounts[] = [
            "email" => $row['email'],
            "name" => $row['username'],
            "avatar" => $row['profile_pic'],
            "role" => $row['role']
        ];
    }
    $stmt->close();
    
    echo json_encode([
        "status" => "success",
        "accounts" => $accounts
    ]);
}

$conn->close();
exit;