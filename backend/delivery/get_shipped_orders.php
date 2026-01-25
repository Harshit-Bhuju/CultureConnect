<?php
require_once __DIR__ . '/../config/session_config.php';
include("../config/header.php");

// Allow delivery boys to fetch orders
if (!isset($_SESSION['logged_in']) || $_SESSION['logged_in'] !== true) {
    echo json_encode(["status" => "error", "message" => "Unauthorized access."]);
    exit;
}

try {
    // Capture status from query param, default to 'shipped'
    $status_filter = isset($_GET['status']) ? $_GET['status'] : 'shipped';

    // Ensure only valid statuses are used to prevent issues
    $valid_statuses = ['shipped', 'delivered_pending', 'completed'];
    if (!in_array($status_filter, $valid_statuses)) {
        $status_filter = 'shipped';
    }

    // Fetch all orders with specific status
    $stmt = $conn->prepare("
        SELECT 
            o.id, 
            o.order_number, 
            o.user_id, 
            o.product_id, 
            o.quantity, 
            o.total_amount as price,
            o.order_status as status,
            o.delivery_province,
            o.delivery_district,
            o.delivery_municipality,
            o.delivery_ward,
            p.product_name,
            u.username as customer_name,
            u.email as customer_email,
            IF(dr.id IS NOT NULL, 1, 0) as has_report
        FROM orders o
        JOIN products p ON o.product_id = p.id
        JOIN users u ON o.user_id = u.id
        LEFT JOIN delivery_reports dr ON o.id = dr.order_id
        WHERE o.order_status = ?
        ORDER BY o.created_at DESC
    ");

    $stmt->bind_param("s", $status_filter);
    $stmt->execute();
    $result = $stmt->get_result();

    $deliveries = [];
    while ($row = $result->fetch_assoc()) {
        $address = "{$row['delivery_province']}, {$row['delivery_district']}, {$row['delivery_municipality']}, {$row['delivery_ward']}";
        $deliveries[] = [
            'id' => "#{$row['order_number']}",
            'order_id' => $row['id'],
            'customer' => $row['customer_name'],
            'email' => $row['customer_email'],
            'product' => $row['product_name'],
            'address' => $address,
            'status' => ucfirst($row['status']),
            'price' => "Rs. " . number_format($row['price'], 2),
            'items' => "{$row['quantity']}x {$row['product_name']}",
            'has_report' => (bool)$row['has_report'],
            'estimatedTime' => "Processing"
        ];
    }

    echo json_encode(["status" => "success", "orders" => $deliveries]);
} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}

$conn->close();
exit;
