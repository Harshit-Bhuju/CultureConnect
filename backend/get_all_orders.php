<?php
session_start();
include("header.php");

try {
    if (!isset($_SESSION['user_email'])) {
        echo json_encode(["success" => false, "error" => "User not logged in"]);
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

    // Get ALL orders for this seller with updated schema
    $stmt = $conn->prepare("
        SELECT 
            o.id,
            o.order_number,
            o.order_status,
            o.quantity,
            o.product_price,
            o.subtotal,
            o.delivery_province,
            o.delivery_district,
            o.delivery_municipality,
            o.delivery_ward,
            o.delivery_charge,
            o.delivery_distance_km,
            o.total_amount,
            o.estimated_delivery_time,
            o.created_at,
            o.updated_at,
            u.username as customer_name,
            u.email as customer_email,
            pt.payment_method,
            pt.payment_status,
            pt.transaction_uuid,
            p.id as product_id,
            p.product_name,
            pi.image_url as product_image,
            oc.reason as cancellation_reason,
            oc.description as cancellation_description,
            oc.cancelled_by,
            oc.cancelled_at
        FROM orders o
        INNER JOIN users u ON o.user_id = u.id
        INNER JOIN products p ON o.product_id = p.id
         LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.`order` = 1
        LEFT JOIN payment_transactions pt ON o.id = pt.order_id
        LEFT JOIN order_cancellation oc ON o.id = oc.order_id
        WHERE o.seller_id = ?
        ORDER BY o.created_at DESC
    ");

    $stmt->bind_param("i", $seller_id);
    $stmt->execute();
    $result = $stmt->get_result();

    $orders = [];
    while ($row = $result->fetch_assoc()) {
        // Format delivery location
        $delivery_parts = array_filter([
            $row['delivery_ward'],
            $row['delivery_municipality'],
            $row['delivery_district'],
            $row['delivery_province']
        ]);
        $delivery_location = implode(', ', $delivery_parts);

        // Format payment method display
        $payment_method_display = '';
        if ($row['payment_method']) {
            $payment_method_display = match ($row['payment_method']) {
                'esewa' => 'eSewa',
                'cod' => 'Cash on Delivery',
                default => ucfirst($row['payment_method'])
            };
        }

        // Format payment status display
        $payment_status_display = 'Pending';
        if ($row['payment_status']) {
            $payment_status_display = match ($row['payment_status']) {
                'success' => 'Paid',
                'pending' => 'Pending',
                'failed' => 'Failed',
                'refunded' => 'Refunded',
                default => ucfirst($row['payment_status'])
            };
        }

        // Format estimated delivery time
        $estimated_delivery = $row['estimated_delivery_time']
            ? date('j F Y', strtotime($row['estimated_delivery_time']))
            : 'Not set';

        // Format order status for display
        $status_display = match ($row['order_status']) {
            'processing' => 'Processing',
            'shipped' => 'Shipped',
            'completed' => 'Completed',
            'cancelled' => 'Cancelled',
            default => ucfirst($row['order_status'])
        };

        // Format cancelled_by for display
        $cancelled_by_display = null;
        if ($row['cancelled_by']) {
            $cancelled_by_display = match ($row['cancelled_by']) {
                'user' => 'Customer',
                'seller' => 'Seller',
                'system' => 'System',
                default => ucfirst($row['cancelled_by'])
            };
        }

        // Format cancellation date
        $cancelled_at_formatted = $row['cancelled_at']
            ? date('j F Y g:i A', strtotime($row['cancelled_at']))
            : null;

        $orders[] = [
            'order_id' => (int)$row['id'],
            'order_number' => $row['order_number'],
            'customerName' => $row['customer_name'],
            'customerEmail' => $row['customer_email'],
            'status' => $row['order_status'],
            'status_display' => $status_display,
            'quantity' => (int)$row['quantity'],
            'productPrice' => (float)$row['product_price'],
            'subtotal' => (float)$row['subtotal'],
            'delivery_charge' => (float)$row['delivery_charge'],
            'totalAmount' => (float)$row['total_amount'],
            'orderDate' => date("j F Y g:i A", strtotime($row['created_at'])),
            'updatedAt' => date("j F Y g:i A", strtotime($row['updated_at'])),
            'delivery_location' => $delivery_location,
            'estimated_delivery_time' => $estimated_delivery,
            'delivery_distance_km' => (float)$row['delivery_distance_km'],
            'payment_method' => $payment_method_display,
            'payment_status' => $payment_status_display,
            'transaction_uuid' => $row['transaction_uuid'],
            'productId' => (int)$row['product_id'],
            'productName' => $row['product_name'],
            'productImage' => $row['product_image'],
            'cancellation_reason' => $row['cancellation_reason'],
            'cancellation_description' => $row['cancellation_description'],
            'cancelled_by' => $cancelled_by_display,
            'cancelled_at' => $cancelled_at_formatted
        ];
    }
    $stmt->close();

    // Get order statistics
    $stats_stmt = $conn->prepare("
        SELECT 
            COUNT(*) as total_orders,
            SUM(CASE WHEN order_status = 'processing' THEN 1 ELSE 0 END) as processing_count,
            SUM(CASE WHEN order_status = 'shipped' THEN 1 ELSE 0 END) as shipped_count,
            SUM(CASE WHEN order_status = 'completed' THEN 1 ELSE 0 END) as completed_count,
            SUM(CASE WHEN order_status = 'cancelled' THEN 1 ELSE 0 END) as cancelled_count,
            
            SUM(CASE WHEN order_status = 'completed' THEN total_amount ELSE 0 END) as completed_revenue,
            SUM(CASE WHEN order_status = 'completed' THEN quantity ELSE 0 END) as completed_items,
            
            SUM(CASE WHEN order_status = 'cancelled' THEN total_amount ELSE 0 END) as cancelled_revenue,
            SUM(CASE WHEN order_status = 'cancelled' THEN quantity ELSE 0 END) as cancelled_items,
            
            SUM(CASE WHEN order_status IN ('processing', 'shipped') THEN total_amount ELSE 0 END) as active_revenue,
            SUM(CASE WHEN order_status IN ('processing', 'shipped') THEN quantity ELSE 0 END) as active_items
        FROM orders
        WHERE seller_id = ?
    ");

    $stats_stmt->bind_param("i", $seller_id);
    $stats_stmt->execute();
    $stats_result = $stats_stmt->get_result();
    $stats = $stats_result->fetch_assoc();
    $stats_stmt->close();

    echo json_encode([
        'success' => true,
        'orders' => $orders,
        'stats' => [
            'total_orders' => (int)$stats['total_orders'],
            'processing_count' => (int)$stats['processing_count'],
            'shipped_count' => (int)$stats['shipped_count'],
            'completed_count' => (int)$stats['completed_count'],
            'cancelled_count' => (int)$stats['cancelled_count'],
            'completed_revenue' => (float)$stats['completed_revenue'],
            'completed_items' => (int)$stats['completed_items'],
            'cancelled_revenue' => (float)$stats['cancelled_revenue'],
            'cancelled_items' => (int)$stats['cancelled_items'],
            'active_revenue' => (float)$stats['active_revenue'],
            'active_items' => (int)$stats['active_items']
        ]
    ]);
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}

$conn->close();