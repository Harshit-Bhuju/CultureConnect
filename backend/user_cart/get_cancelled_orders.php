<?php
session_start();
include(__DIR__ . "/../header.php");

try {
    if (!isset($_SESSION['user_email'])) {
        echo json_encode(['success' => false, 'error' => 'User not authenticated']);
        exit;
    }

    $user_email = $_SESSION['user_email'];
    $period = $_GET['period'] ?? 'Until now';

    // Get user_id
    $stmt = $conn->prepare("SELECT id FROM users WHERE email = ? LIMIT 1");
    $stmt->bind_param("s", $user_email);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();
    $stmt->close();

    if (!$user) {
        echo json_encode(['success' => false, 'error' => 'User not found']);
        exit;
    }

    $user_id = $user['id'];

    // Build date filter
    $date_filter = "";
    if ($period === 'This month') {
        $date_filter = "AND DATE_FORMAT(o.updated_at, '%Y-%m') = DATE_FORMAT(NOW(), '%Y-%m')";
    } elseif ($period === 'This year') {
        $date_filter = "AND YEAR(o.updated_at) = YEAR(NOW())";
    }

    // Get cancelled orders with cancellation details
    $query = "
        SELECT 
            o.id,
            o.order_number,
            o.product_id as productId,
            o.quantity,
            o.product_price as productPrice,
            o.subtotal,
            o.delivery_charge,
            o.total_amount as totalAmount,
            o.order_status as status,
            o.created_at as orderDate,
            o.updated_at as updatedAt,
            CONCAT(o.delivery_province, ', ', o.delivery_district, ', ', 
                   o.delivery_municipality, ', ', o.delivery_ward) as delivery_location,
            p.product_name as productName,
            p.category,
            pi.image_url as imageUrl,
            pt.transaction_uuid,
            pt.payment_method,
            CASE 
                WHEN pt.payment_status = 'refunded' THEN 'Refunded'
                WHEN pt.payment_status = 'pending_refund' THEN 'Pending'
                WHEN pt.payment_status = 'failed' THEN 'Failed'
                ELSE 'N/A'
            END as payment_status,
            oc.reason as cancellation_reason,
            oc.description as cancellation_description,
            oc.cancelled_by,
            oc.cancelled_at
        FROM orders o
        JOIN products p ON o.product_id = p.id
        LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.`order` = 1
        LEFT JOIN payment_transactions pt ON o.id = pt.order_id
        LEFT JOIN order_cancellation oc ON o.id = oc.order_id
        WHERE o.user_id = ? 
        AND o.order_status = 'cancelled'
        $date_filter
        ORDER BY o.updated_at DESC
    ";

    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();

    $orders = [];
    while ($row = $result->fetch_assoc()) {
        $orders[] = [
            'id' => (int)$row['id'],
            'order_number' => $row['order_number'],
            'productId' => (int)$row['productId'],
            'productName' => $row['productName'],
            'category' => $row['category'],
            'productImage' => $row['imageUrl'],
            'quantity' => (int)$row['quantity'],
            'productPrice' => (float)$row['productPrice'],
            'subtotal' => (float)$row['subtotal'],
            'delivery_charge' => (float)$row['delivery_charge'],
            'totalAmount' => (float)$row['totalAmount'],
            'delivery_location' => $row['delivery_location'],
            'transaction_uuid' => $row['transaction_uuid'],
            'payment_method' => strtoupper($row['payment_method']),
            'payment_status' => $row['payment_status'],
            'status' => 'cancelled',
            'orderDate' => date("j F Y g:i A", strtotime($row['orderDate'])),
            'updatedAt' => date("j F Y g:i A", strtotime($row['updatedAt'])),
            'cancellation' => [
                'reason' => $row['cancellation_reason'],
                'description' => $row['cancellation_description'],
                'cancelled_by' => $row['cancelled_by'],
                'cancelled_at' => $row['cancelled_at'] ? date("j F Y g:i A", strtotime($row['cancelled_at'])) : null
            ]
        ];
    }
    $stmt->close();

    echo json_encode([
        'success' => true,
        'orders' => $orders,
        'period' => $period,
        'count' => count($orders)
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}

$conn->close();
