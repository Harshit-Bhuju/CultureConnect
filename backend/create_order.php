<?php
session_start();
include("header.php");

try {
    $user_email = $_SESSION['user_email'];

    if (!$user_email) {
        echo json_encode(["success" => false, "error" => "User not authenticated"]);
        exit;
    }

    // Get POST data
    $seller_id = $_POST['seller_id'] ?? null;
    $product_id = $_POST['product_id'] ?? null;
    $quantity = $_POST['quantity'] ?? 1;
    $delivery_province = $_POST['delivery_province'] ?? null;
    $delivery_district = $_POST['delivery_district'] ?? null;
    $delivery_municipality = $_POST['delivery_municipality'] ?? null;
    $delivery_ward = $_POST['delivery_ward'] ?? null;

    // Validate required fields
    if (!$seller_id || !$product_id || !$delivery_province || !$delivery_district || !$delivery_municipality || !$delivery_ward) {
        echo json_encode(["success" => false, "error" => "Missing required fields"]);
        exit;
    }

    // Validate quantity
    if ($quantity < 1) {
        echo json_encode(["success" => false, "error" => "Invalid quantity"]);
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

    // Get product details and verify stock
    $stmt = $conn->prepare("
        SELECT 
            id,
            seller_id,
            product_name,
            price,
            stock,
            status
        FROM products 
        WHERE id = ? AND seller_id = ? AND status = 'published'
        LIMIT 1
    ");
    $stmt->bind_param("ii", $product_id, $seller_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $product = $result->fetch_assoc();
    $stmt->close();

    if (!$product) {
        echo json_encode(["success" => false, "error" => "Product not found or not available"]);
        exit;
    }

    if ($product['stock'] < $quantity) {
        echo json_encode([
            "success" => false,
            "error" => "Insufficient stock. Available: " . $product['stock'],
            "availableStock" => (int)$product['stock']
        ]);
        exit;
    }

    // Check if there's an existing no_payment order for this user and product
    $stmt = $conn->prepare("
        SELECT id 
        FROM orders 
        WHERE user_id = ? 
        AND product_id = ? 
        AND order_status = 'no_payment' 
        AND created_at > DATE_SUB(NOW(), INTERVAL 1 HOUR)
        LIMIT 1
    ");
    $stmt->bind_param("ii", $user_id, $product_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $existing_order = $result->fetch_assoc();
    $stmt->close();

    // Start transaction
    $conn->begin_transaction();

    try {
        if ($existing_order) {
            // Update existing order
            $order_id = $existing_order['id'];
            
            $stmt = $conn->prepare("
                UPDATE orders SET
                    quantity = ?,
                    delivery_province = ?,
                    delivery_district = ?,
                    delivery_municipality = ?,
                    delivery_ward = ?,
                    updated_at = NOW()
                WHERE id = ?
            ");

            $stmt->bind_param(
                "issssi",
                $quantity,
                $delivery_province,
                $delivery_district,
                $delivery_municipality,
                $delivery_ward,
                $order_id
            );

            $stmt->execute();
            $stmt->close();
        } else {
            // Create new order with no_payment status
            $stmt = $conn->prepare("
                INSERT INTO orders (
                    user_id,
                    seller_id,
                    product_id,
                    quantity,
                    delivery_province,
                    delivery_district,
                    delivery_municipality,
                    delivery_ward,
                    order_status
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'no_payment')
            ");

            $stmt->bind_param(
                "iiiissss",
                $user_id,
                $seller_id,
                $product_id,
                $quantity,
                $delivery_province,
                $delivery_district,
                $delivery_municipality,
                $delivery_ward
            );

            $stmt->execute();
            $order_id = $conn->insert_id;
            $stmt->close();
        }

        // Get the complete order details (including calculated fields from triggers)
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
                p.product_name,
                pi.image_url
            FROM orders o
            JOIN products p ON o.product_id = p.id
            LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.`order` = 1
            WHERE o.id = ?
            LIMIT 1
        ");
        $stmt->bind_param("i", $order_id);
        $stmt->execute();
        $result = $stmt->get_result();
        $order = $result->fetch_assoc();
        $stmt->close();

        // Commit transaction
        $conn->commit();

        // Prepare response
        $response = [
            "success" => true,
            "order" => [
                "id" => (int)$order['id'],
                "order_number" => $order['order_number'],
                "product_id" => (int)$order['product_id'],
                "product_name" => $order['product_name'],
                "product_image" => $order['image_url'],
                "quantity" => (int)$order['quantity'],
                "product_price" => (float)$order['product_price'],
                "subtotal" => (float)$order['subtotal'],
                "delivery_charge" => (float)$order['delivery_charge'],
                "delivery_distance_km" => (float)$order['delivery_distance_km'],
                "total_amount" => (float)$order['total_amount'],
                "estimated_delivery_time" => $order['estimated_delivery_time'],
                "order_status" => $order['order_status'],
                "created_at" => $order['created_at']
            ],
            "delivery_location" => [
                "province" => $order['delivery_province'],
                "district" => $order['delivery_district'],
                "municipality" => $order['delivery_municipality'],
                "ward" => $order['delivery_ward']
            ]
        ];

        echo json_encode($response);
    } catch (Exception $e) {
        $conn->rollback();
        throw $e;
    }
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}

$conn->close();
?>