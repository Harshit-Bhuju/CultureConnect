<?php
session_start();
include("header.php");

try {
    if (!isset($_SESSION['user_email'])) {
        echo json_encode(["success" => false, "error" => "User not logged in"]);
        exit;
    }

    // Get POST data
    $order_number = $_POST['order_number'] ?? null;
    $new_status = $_POST['new_status'] ?? null;

    if (!$order_number || !$new_status) {
        echo json_encode(["success" => false, "error" => "Missing required fields"]);
        exit;
    }

    // Validate status
    $valid_statuses = ['processing', 'shipped', 'completed', 'cancelled'];
    if (!in_array($new_status, $valid_statuses)) {
        echo json_encode(["success" => false, "error" => "Invalid status"]);
        exit;
    }

    $user_email = $_SESSION['user_email'];

    // Get user's seller_id
    $stmt = $conn->prepare("
        SELECT u.id, s.id as seller_id 
        FROM users u 
        LEFT JOIN sellers s ON u.id = s.user_id 
        WHERE u.email = ? 
        LIMIT 1
    ");
    $stmt->bind_param("s", $user_email);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();
    $stmt->close();

    if (!$user || !$user['seller_id']) {
        echo json_encode(["success" => false, "error" => "No seller account found"]);
        exit;
    }

    $seller_id = $user['seller_id'];

    // Verify the order belongs to this seller
    $stmt = $conn->prepare("
        SELECT id, order_status 
        FROM orders 
        WHERE order_number = ? AND seller_id = ?
        LIMIT 1
    ");
    $stmt->bind_param("si", $order_number, $seller_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $order = $result->fetch_assoc();
    $stmt->close();

    if (!$order) {
        echo json_encode(["success" => false, "error" => "Order not found or unauthorized"]);
        exit;
    }

    // Update the order status - updated_at will be automatically updated by trigger
    $stmt = $conn->prepare("
        UPDATE orders 
        SET order_status = ?
        WHERE order_number = ? AND seller_id = ?
    ");
    $stmt->bind_param("ssi", $new_status, $order_number, $seller_id);

    if ($stmt->execute()) {
        $stmt->close();

        echo json_encode([
            'success' => true,
            'new_status' => $new_status,
            'order_number' => $order_number
        ]);
    } else {
        $stmt->close();
        echo json_encode([
            'success' => false,
            'error' => 'Failed to update order status'
        ]);
    }
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}

$conn->close();
