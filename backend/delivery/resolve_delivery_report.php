<?php
require_once __DIR__ . '/../config/session_config.php';
include("../config/header.php");

if (!isset($_SESSION['logged_in']) || $_SESSION['logged_in'] !== true) {
    echo json_encode(["status" => "error", "message" => "Unauthorized access."]);
    exit;
}

$order_id = isset($_POST['order_id']) ? intval($_POST['order_id']) : null;

if (!$order_id) {
    echo json_encode(["status" => "error", "message" => "Order ID required."]);
    exit;
}

try {
    // Begin transaction
    $conn->begin_transaction();

    // 1. Delete associated report from delivery_reports
    $stmt = $conn->prepare("DELETE FROM delivery_reports WHERE order_id = ?");
    $stmt->bind_param("i", $order_id);
    $stmt->execute();
    $stmt->close();

    // 2. Update order status back to 'delivered_pending'
    $stmt = $conn->prepare("UPDATE orders SET order_status = 'delivered_pending' WHERE id = ?");
    $stmt->bind_param("i", $order_id);
    $stmt->execute();
    $stmt->close();

    // Commit transaction
    $conn->commit();

    echo json_encode([
        "status" => "success",
        "message" => "Discrepancy resolved. The order has been reset to 'Pending Confirmation' status."
    ]);
} catch (Exception $e) {
    $conn->rollback();
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}

$conn->close();
exit;
