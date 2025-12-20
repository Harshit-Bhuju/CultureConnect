<?php
session_start();
include("header.php");

header('Content-Type: application/json');

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

    // Build query based on period
    if ($period === "This month") {
        // Get current month's stats from product_sales_stats
        $query = "
            SELECT 
                p.id,
                p.product_name,
                p.status,
                COALESCE(pss.sales_count, 0) as units_sold,
                COALESCE(pss.revenue, 0) as revenue
            FROM products p
            LEFT JOIN product_sales_stats pss ON p.id = pss.product_id 
                AND DATE_FORMAT(pss.month, '%Y-%m') = DATE_FORMAT(NOW(), '%Y-%m')
            WHERE p.seller_id = ?
            AND pss.sales_count > 0
            ORDER BY units_sold DESC
              LIMIT 50
        ";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("i", $seller_id);
    } elseif ($period === "This year") {
        // Sum all months in current year from product_sales_stats
        $query = "
            SELECT 
                p.id,
                p.product_name,
                p.status,
                COALESCE(SUM(pss.sales_count), 0) as units_sold,
                COALESCE(SUM(pss.revenue), 0) as revenue
            FROM products p
            LEFT JOIN product_sales_stats pss ON p.id = pss.product_id 
                AND YEAR(pss.month) = YEAR(NOW())
            WHERE p.seller_id = ?
            GROUP BY p.id, p.product_name, p.status
            HAVING units_sold > 0
            ORDER BY units_sold DESC
              LIMIT 50
        ";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("i", $seller_id);
    } else {
        // "Until now" - use total_sales from products table
        $query = "
            SELECT 
                p.id,
                p.product_name,
                p.status,
                p.total_sales as units_sold,
                p.revenue
            FROM products p
            WHERE p.seller_id = ?
            AND p.total_sales > 0
            ORDER BY units_sold DESC
              LIMIT 50
        ";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("i", $seller_id);
    }

    $stmt->execute();
    $result = $stmt->get_result();

    $top_products = [];
    while ($row = $result->fetch_assoc()) {
        $top_products[] = [
            'product_id' => (int)$row['id'],
            'product_name' => $row['product_name'],
            'status' => $row['status'],
            'units_sold' => (int)$row['units_sold'],
            'revenue' => (float)$row['revenue']
        ];
    }
    $stmt->close();

    echo json_encode([
        'success' => true,
        'period' => $period,
        'top_products' => $top_products,
        'count' => count($top_products)
    ]);
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}

$conn->close();
