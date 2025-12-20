<?php
include("session_helper.php");
include("header.php");

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $current_user_email = $_SESSION['user_email'] ?? '';
    $device_id = getDeviceId(); // Get from cookie
    
    if (!$current_user_email) {
        echo json_encode([
            "status" => "success",
            "accounts" => []
        ]);
        exit;
    }
    
    // Get all saved accounts for THIS device (excluding current user and admins)
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