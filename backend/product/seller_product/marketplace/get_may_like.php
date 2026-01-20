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

    // Popularity Score Formula:
    // 1. Sales this month (x15) - Highest weight for current trends.
    // 2. Total product sales (x2) - Long-term reliability.
    // 3. Store Authority (x0.5) - A small "Trust Bonus" for proven sellers. 
    //    Helps reliable stores launch new items with better visibility.
    // 4. Quality impact (Avg Rating * Reviews) - Verified satisfaction score.
    // 5. Freshness Boost (+10) - Discoverability boost for items < 30 days old.
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
            (
                (COALESCE(current_ps.sales_count, 0) * 15) +  
                (COALESCE(p.total_sales, 0) * 2) +            
                (COALESCE(s.total_sales, 0) * 0.5) +          
                (COALESCE(p.average_rating, 0) * COALESCE(p.total_reviews, 1) * 0.5) + 
                (CASE WHEN p.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 10 ELSE 0 END) 
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
