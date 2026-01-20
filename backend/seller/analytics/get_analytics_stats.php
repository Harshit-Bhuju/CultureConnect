<?php
require_once __DIR__ . '/../../config/session_config.php';
include("../../config/header.php");

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

    // Get period from request (default: "This month")
    $period = isset($_GET['period']) ? $_GET['period'] : 'This month';

    // Fetch stats from sellers table based on period
    $stmt = $conn->prepare("
        SELECT 
            CASE 
                WHEN ? = 'This month' THEN sales_this_month
                WHEN ? = 'This year' THEN sales_this_year
                ELSE total_sales
            END as products_sold,
            CASE 
                WHEN ? = 'This month' THEN revenue_this_month
                WHEN ? = 'This year' THEN revenue_this_year
                ELSE total_revenue
            END as total_revenue
        FROM sellers
        WHERE id = ?
    ");

    $stmt->bind_param("ssssi", $period, $period, $period, $period, $seller_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $seller_stats = $result->fetch_assoc();
    $stmt->close();

    // Calculate total orders for the period
    $date_condition = "";
    if ($period === "This month") {
        $date_condition = "AND DATE_FORMAT(o.created_at, '%Y-%m') = DATE_FORMAT(NOW(), '%Y-%m')";
    } elseif ($period === "This year") {
        $date_condition = "AND YEAR(o.created_at) = YEAR(NOW())";
    }

    $order_stmt = $conn->prepare("
        SELECT COUNT(DISTINCT o.id) as total_orders
        FROM orders o
        WHERE o.seller_id = ? 
        $date_condition
    ");

    $order_stmt->bind_param("i", $seller_id);
    $order_stmt->execute();
    $order_result = $order_stmt->get_result();
    $order_data = $order_result->fetch_assoc();
    $order_stmt->close();

    // Get product statistics
    $product_stmt = $conn->prepare("
        SELECT 
            COUNT(CASE WHEN status = 'published' THEN 1 END) as active_products,
            COUNT(CASE WHEN status = 'draft' THEN 1 END) as draft_products,
            COUNT(CASE WHEN status = 'deleted' THEN 1 END) as deleted_products,
            COUNT(*) as total_products
        FROM products
        WHERE seller_id = ?
    ");

    $product_stmt->bind_param("i", $seller_id);
    $product_stmt->execute();
    $product_result = $product_stmt->get_result();
    $product_data = $product_result->fetch_assoc();
    $product_stmt->close();

    // Calculate average order value
    $total_orders = (int)$order_data['total_orders'];
    $total_revenue = (float)$seller_stats['total_revenue'];
    $avg_order_value = $total_orders > 0 ? $total_revenue / $total_orders : 0;

    echo json_encode([
        'success' => true,
        'period' => $period,
        'stats' => [
            'total_revenue' => $total_revenue,
            'products_sold' => (int)$seller_stats['products_sold'],
            'total_orders' => $total_orders,
            'avg_order_value' => round($avg_order_value, 2)
        ],
        'product_stats' => [
            'active_products' => (int)$product_data['active_products'],
            'draft_products' => (int)$product_data['draft_products'],
            'deleted_products' => (int)$product_data['deleted_products'],
            'total_products' => (int)$product_data['total_products']
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
