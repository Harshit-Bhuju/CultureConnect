<?php
session_start();
include("header.php");

try {
    $user_email = $_SESSION['user_email'];

    if (!$user_email) {
        echo json_encode(["success" => false, "error" => "User not authenticated"]);
        exit;
    }

    $order_id = $_GET['order_id'] ?? null;

    if (!$order_id) {
        echo json_encode(["success" => false, "error" => "Order ID is required"]);
        exit;
    }

    // Get user_id
    $stmt = $conn->prepare("SELECT id FROM users WHERE email = ? LIMIT 1");
    $stmt->bind_param("s", $user_email);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();
    $stmt->close();

    if (!$user) {
        echo json_encode(["success" => false, "error" => "User not found"]);
        exit;
    }

    $user_id = $user['id'];

    // Get order details with product info
    $stmt = $conn->prepare("
        SELECT 
            o.id,
            o.order_number,
            o.user_id,
            o.seller_id,
            o.product_id,
            o.quantity,
            o.product_price,
            o.subtotal,
            o.delivery_province,
            o.delivery_district,
            o.delivery_municipality,
            o.delivery_ward,
            o.order_status,
            o.delivery_distance_km,
            o.delivery_charge,
            o.total_amount,
            o.estimated_delivery_time,
            o.created_at,
            o.updated_at,
            p.product_name,
            p.category,
            pi.image_url,
            s.store_name,
            s.store_logo
        FROM orders o
        JOIN products p ON o.product_id = p.id
        LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.`order` = 1
        JOIN sellers s ON o.seller_id = s.id
        WHERE o.id = ? AND o.user_id = ?
        LIMIT 1
    ");
    $stmt->bind_param("ii", $order_id, $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $order = $result->fetch_assoc();
    $stmt->close();

    if (!$order) {
        echo json_encode(["success" => false, "error" => "Order not found"]);
        exit;
    }

    // Get payment transaction details
    $stmt = $conn->prepare("
        SELECT 
            id,
            transaction_uuid,
            payment_method,
            payment_status,
            amount,
            payment_date,
            created_at,
            updated_at
        FROM payment_transactions
        WHERE order_id = ?
        LIMIT 1
    ");
    $stmt->bind_param("i", $order_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $payment = $result->fetch_assoc();
    $stmt->close();

    // Prepare response
    $response = [
        "success" => true,
        "order" => [
            "id" => (int)$order['id'],
            "order_number" => $order['order_number'],
            "product_id" => (int)$order['product_id'],
            "product_name" => $order['product_name'],
            "product_image" => $order['image_url'],
            "category" => $order['category'],
            "store_name" => $order['store_name'],
            "store_logo" => $order['store_logo'],
            "quantity" => (int)$order['quantity'],
            "product_price" => (float)$order['product_price'],
            "subtotal" => (float)$order['subtotal'],
            "delivery_charge" => (float)$order['delivery_charge'],
            "delivery_distance_km" => (float)$order['delivery_distance_km'],
            "total_amount" => (float)$order['total_amount'],
            "estimated_delivery_time" => $order['estimated_delivery_time'],
            "order_status" => $order['order_status'],
            "created_at" => $order['created_at'],
            "updated_at" => $order['updated_at']
        ],
        "payment" => [
            "id" => (int)$payment['id'],
            "transaction_uuid" => $payment['transaction_uuid'],
            "payment_method" => $payment['payment_method'],
            "payment_status" => $payment['payment_status'],
            "amount" => (float)$payment['amount'],
            "payment_date" => $payment['payment_date'],
            "created_at" => $payment['created_at'],
            "updated_at" => $payment['updated_at']
        ],
        "delivery_location" => [
            "name" => "{$order['delivery_province']}, {$order['delivery_district']}, {$order['delivery_municipality']}, {$order['delivery_ward']}",
            "province" => $order['delivery_province'],
            "district" => $order['delivery_district'],
            "municipality" => $order['delivery_municipality'],
            "ward" => $order['delivery_ward']
        ]
    ];

    echo json_encode($response);
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}

$conn->close();
