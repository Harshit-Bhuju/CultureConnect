<?php
require_once __DIR__ . '/../../../config/session_config.php';
include(__DIR__ . "/../../../config/header.php");


try {
    $products = [];

    // Get current week's date range
    $week_start = date('Y-m-d', strtotime('monday this week'));
    $week_end = date('Y-m-d', strtotime('sunday this week'));

    // Current month for recent sales
    $current_month = date('Y-m-01');

    // Limit for products (default 100, max 100)
    $limit = isset($_GET['limit']) ? min((int)$_GET['limit'], 100) : 100;

    // Query: Get popular products based on views, sales, and engagement
    $stmt = $conn->prepare("
        SELECT 
            p.id,
            p.seller_id,
            p.product_name AS title,
            p.price,
            p.category,
            p.average_rating AS rating,
            p.total_reviews AS reviews,
            p.total_sales,
            pi.image_url AS image,
            s.store_name,
            -- Calculate popularity score (works even with 0 sales)
            (
                (COALESCE(current_ps.sales_count, 0) * 10) +  -- Sales this month
                (COALESCE(p.total_sales, 0) * 1) +            -- Total sales (default to 0)
                (COALESCE(p.average_rating, 0) * COALESCE(p.total_reviews, 0) * 0.5) + -- Rating impact
                (COALESCE(p.total_reviews, 0) * 0.2) +        -- Review count
                (CASE WHEN p.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 5 ELSE 0 END) -- Boost new products
            ) AS popularity_score
        FROM products p
        INNER JOIN sellers s ON p.seller_id = s.id
        LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.`order` = 1
        LEFT JOIN product_sales_stats current_ps 
            ON p.id = current_ps.product_id AND current_ps.month = ?
        WHERE p.status = 'published'
          AND p.stock > 0
          AND pi.image_url IS NOT NULL
        ORDER BY 
            popularity_score DESC,
            p.created_at DESC
        LIMIT ?
    ");

    $stmt->bind_param("si", $current_month, $limit);
    $stmt->execute();
    $result = $stmt->get_result();

    while ($row = $result->fetch_assoc()) {
        $products[] = [
            'id' => (int)$row['id'],
            'seller_id' => (int)$row['seller_id'],
            'title' => $row['title'],
            'price' => (float)$row['price'],
            'category' => $row['category'],
            'image' => $row['image'],
            'rating' => (float)$row['rating'],
            'reviews' => (int)$row['reviews'],
            'total_sales' => (int)$row['total_sales'],
            'store_name' => $row['store_name'],
            'popularity_score' => (float)$row['popularity_score']
        ];
    }
    $stmt->close();

    echo json_encode([
        'success' => true,
        'products' => $products,
        'count' => count($products),
        'week_period' => [
            'start' => $week_start,
            'end' => $week_end
        ],
        'message' => count($products) > 0
            ? 'Popular products loaded successfully'
            : 'No products available'
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Server error: ' . $e->getMessage()
    ]);
}

$conn->close();
