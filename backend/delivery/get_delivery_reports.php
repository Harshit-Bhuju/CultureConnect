<?php
require_once __DIR__ . '/../config/session_config.php';
include("../config/header.php");

if (!isset($_SESSION['logged_in']) || $_SESSION['logged_in'] !== true) {
    echo json_encode(["status" => "error", "message" => "Unauthorized access."]);
    exit;
}

try {
    // For now, show all reports as requested for demonstration
    // JOIN with orders and products to provide context
    $stmt = $conn->prepare("
        SELECT 
            dr.id as report_id,
            dr.reported_at,
            dr.status as report_status,
            o.id as order_id,
            o.order_number,
            o.total_amount,
            p.product_name,
            u.username as customer_name
        FROM delivery_reports dr
        JOIN orders o ON dr.order_id = o.id
        JOIN products p ON o.product_id = p.id
        JOIN users u ON o.user_id = u.id
        ORDER BY dr.reported_at DESC
    ");

    $stmt->execute();
    $result = $stmt->get_result();

    $reports = [];
    while ($row = $result->fetch_assoc()) {
        $reports[] = [
            'id' => $row['report_id'],
            'order_id' => $row['order_id'],
            'order_no' => "#" . $row['order_number'],
            'product' => $row['product_name'],
            'customer' => $row['customer_name'],
            'amount' => "Rs. " . number_format($row['total_amount'], 2),
            'time' => date('M j, Y g:i A', strtotime($row['reported_at'])),
            'status' => $row['report_status']
        ];
    }

    echo json_encode(["status" => "success", "reports" => $reports]);
} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}

$conn->close();
exit;
