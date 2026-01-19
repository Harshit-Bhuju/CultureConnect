<?php
require_once __DIR__ . '/../../../config/session_config.php';
include(__DIR__ . "/../../../config/header.php");


try {
    $products = [];

    // Get category from query parameter (required)
    $category = isset($_GET['category']) ? trim($_GET['category']) : '';

    // Get audience filter (optional, only for cultural-clothes)
    $audience = isset($_GET['audience']) ? trim($_GET['audience']) : '';

    // Validate category
    $valid_categories = ['cultural-clothes', 'musical-instruments', 'handicraft-decors'];
    if (!in_array($category, $valid_categories)) {
        echo json_encode([
            'success' => false,
            'error' => 'Invalid category. Must be one of: ' . implode(', ', $valid_categories)
        ]);
        exit;
    }

    // Current month for prioritizing recent sales
    $current_month = date('Y-m-01');

    // Build the query
    $query = "
        SELECT 
            p.id,
            p.seller_id,
            p.product_name AS title,
            p.price,
            p.category,
            p.audience,
            pi.image_url AS image,
            p.average_rating AS rating,
            p.total_reviews AS reviews,
            COALESCE(current_ps.sales_count, 0) AS recent_sales,
            COALESCE(SUM(all_ps.sales_count), 0) AS total_sales
        FROM products p
        LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.`order` = 1
        LEFT JOIN product_sales_stats current_ps 
            ON p.id = current_ps.product_id AND current_ps.month = ?
        LEFT JOIN product_sales_stats all_ps 
            ON p.id = all_ps.product_id
        WHERE p.status = 'published'
          AND p.category = ?
          AND pi.image_url IS NOT NULL
    ";

    // Add audience filter if provided (only for cultural-clothes)
    $params = [$current_month, $category];
    $types = "ss";

    if ($category === 'cultural-clothes' && !empty($audience)) {
        $valid_audiences = ['men', 'women', 'boy', 'girl'];
        if (in_array($audience, $valid_audiences)) {
            $query .= " AND p.audience = ?";
            $params[] = $audience;
            $types .= "s";
        }
    }

    $query .= "
        GROUP BY p.id, p.product_name, p.price, p.category, p.audience, pi.image_url, p.average_rating, p.total_reviews
        ORDER BY 
            recent_sales DESC,
            total_sales DESC,
            p.created_at DESC
        LIMIT 12
    ";

    $stmt = $conn->prepare($query);
    $stmt->bind_param($types, ...$params);
    $stmt->execute();
    $result = $stmt->get_result();

    while ($row = $result->fetch_assoc()) {
        $products[] = [

            'id'             => (int)$row['id'],
            'seller_id'      => (int)$row['seller_id'],
            'title'          => $row['title'],
            'price'          => (float)$row['price'],
            'category'       => $row['category'],
            'audience'       => $row['audience'],
            'image'          => $row['image'],
            'rating'         => (float)$row['rating'],
            'reviews'        => (int)$row['reviews'],
            'recent_sales'   => (int)$row['recent_sales'],
            'total_sales'    => (int)$row['total_sales']
        ];
    }

    $stmt->close();

    // Final JSON response
    echo json_encode([
        'success' => true,
        'products' => $products,
        'count' => count($products),
        'category' => $category,
        'audience' => $audience ?: 'all',
        'message' => count($products) > 0
            ? 'Products loaded successfully'
            : 'No products available in this category'
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Server error: ' . $e->getMessage()
    ]);
}

$conn->close();
