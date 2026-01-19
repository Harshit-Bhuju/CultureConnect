<?php
require_once __DIR__ . '/../../../config/session_config.php';
include(__DIR__ . "/../../../config/header.php");


try {
    $products = [];

    // Get optional filters
    $category = isset($_GET['category']) ? trim($_GET['category']) : '';
    $audience = isset($_GET['audience']) ? trim($_GET['audience']) : '';
    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 50; // Default 50 products

    // Current month for prioritizing recent activity
    $current_month = date('Y-m-01');

    // Build the query with popularity metrics
    $query = "
        SELECT 
            p.id,
            p.seller_id,
            p.product_name AS title,
            p.price,
            p.category,
            p.audience,
            p.stock,
            p.average_rating AS rating,
            p.total_reviews AS reviews,
            p.total_sales,
            p.created_at,
            pi.image_url AS image,
            COALESCE(current_ps.sales_count, 0) AS recent_sales,
            s.store_name,
            s.store_logo,
            -- Popularity score calculation
            (
                (COALESCE(current_ps.sales_count, 0) * 5) +  -- Recent sales (highest weight)
                (p.total_sales * 2) +                         -- Total sales (medium weight)
                (p.average_rating * p.total_reviews * 0.5) +  -- Rating impact
                (p.total_reviews * 0.3)                       -- Review count
            ) AS popularity_score
        FROM products p
        INNER JOIN sellers s ON p.seller_id = s.id
        LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.`order` = 1
        LEFT JOIN product_sales_stats current_ps 
            ON p.id = current_ps.product_id AND current_ps.month = ?
        WHERE p.status = 'published'
          AND p.stock > 0
          AND pi.image_url IS NOT NULL
    ";

    // Initialize params
    $params = [$current_month];
    $types = "s";

    // Add category filter if provided
    if (!empty($category)) {
        $valid_categories = ['cultural-clothes', 'musical-instruments', 'handicraft-decors'];
        if (in_array($category, $valid_categories)) {
            $query .= " AND p.category = ?";
            $params[] = $category;
            $types .= "s";
        }
    }

    // Add audience filter if provided (only for cultural-clothes)
    if (!empty($audience)) {
        $valid_audiences = ['men', 'women', 'boy', 'girl'];
        if (in_array($audience, $valid_audiences)) {
            $query .= " AND p.audience = ?";
            $params[] = $audience;
            $types .= "s";
        }
    }

    // Complete the query with ordering and limit
    $query .= "
        ORDER BY 
            popularity_score DESC,
            recent_sales DESC,
            p.total_sales DESC,
            p.average_rating DESC,
            p.created_at DESC
        LIMIT ?
    ";

    $params[] = $limit;
    $types .= "i";

    // Execute query
    $stmt = $conn->prepare($query);
    $stmt->bind_param($types, ...$params);
    $stmt->execute();
    $result = $stmt->get_result();

    while ($row = $result->fetch_assoc()) {
        // Get product tags
        $tagStmt = $conn->prepare("
            SELECT tag 
            FROM product_tags 
            WHERE product_id = ?
        ");
        $tagStmt->bind_param("i", $row['id']);
        $tagStmt->execute();
        $tagResult = $tagStmt->get_result();

        $tags = [];
        while ($tagRow = $tagResult->fetch_assoc()) {
            $tags[] = $tagRow['tag'];
        }
        $tagStmt->close();

        // Get additional culture info for cultural-clothes
        $culture = null;
        if ($row['category'] === 'cultural-clothes') {
            $cultureStmt = $conn->prepare("
                SELECT culture 
                FROM product_clothes 
                WHERE product_id = ? 
                LIMIT 1
            ");
            $cultureStmt->bind_param("i", $row['id']);
            $cultureStmt->execute();
            $cultureResult = $cultureStmt->get_result();
            if ($cultureRow = $cultureResult->fetch_assoc()) {
                $culture = $cultureRow['culture'];
            }
            $cultureStmt->close();
        }

        $products[] = [
            'id' => (int)$row['id'],
            'seller_id' => (int)$row['seller_id'],
            'store_name' => $row['store_name'],
            'store_logo' => $row['store_logo'],
            'title' => $row['title'],
            'price' => (float)$row['price'],
            'category' => $row['category'],
            'audience' => $row['audience'],
            'culture' => $culture,
            'stock' => (int)$row['stock'],
            'image' => $row['image'],
            'rating' => (float)$row['rating'],
            'reviews' => (int)$row['reviews'],
            'total_sales' => (int)$row['total_sales'],
            'recent_sales' => (int)$row['recent_sales'],
            'popularity_score' => (float)$row['popularity_score'],
            'tags' => $tags,
            'created_at' => $row['created_at']
        ];
    }
    $stmt->close();

    // Return success response
    echo json_encode([
        'success' => true,
        'products' => $products,
        'count' => count($products),
        'filters' => [
            'category' => $category ?: 'all',
            'audience' => $audience ?: 'all',
            'limit' => $limit
        ],
        'message' => count($products) > 0
            ? 'Popular products loaded successfully'
            : 'No popular products available'
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Server error: ' . $e->getMessage()
    ]);
}

$conn->close();
