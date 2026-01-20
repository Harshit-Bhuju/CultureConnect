<?php

/**
 * Get Category Products API
 * Fetches products by category with filtering, sorting, and pagination support
 * 
 * Query Parameters:
 * - category (required): 'cultural-clothes', 'musical-instruments', or 'handicraft-decors'
 * - audience (optional): 'men', 'women', 'boy', 'girl' (for cultural-clothes)
 * - sort (optional): 'newest', 'price-low', 'price-high', 'rating' (default: 'newest')
 * - min_price (optional): minimum price filter
 * - max_price (optional): maximum price filter
 * - min_rating (optional): minimum rating filter
 * - page (optional): page number (default: 1)
 * - per_page (optional): items per page (default: 12)
 */

require_once __DIR__ . '/../../../config/session_config.php';
include(__DIR__ . "/../../../config/header.php");

try {
    // Validate required category
    $category = isset($_GET['category']) ? trim($_GET['category']) : '';
    $valid_categories = ['cultural-clothes', 'musical-instruments', 'handicraft-decors'];

    if (empty($category) || !in_array($category, $valid_categories)) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => 'Invalid or missing category. Valid options: ' . implode(', ', $valid_categories)
        ]);
        exit;
    }

    // Get optional filters
    $audience = isset($_GET['audience']) ? trim($_GET['audience']) : '';
    $sort = isset($_GET['sort']) ? trim($_GET['sort']) : 'newest';
    $min_price = isset($_GET['min_price']) && $_GET['min_price'] !== '' ? (float)$_GET['min_price'] : null;
    $max_price = isset($_GET['max_price']) && $_GET['max_price'] !== '' ? (float)$_GET['max_price'] : null;
    $min_rating = isset($_GET['min_rating']) && $_GET['min_rating'] !== '' ? (float)$_GET['min_rating'] : null;

    // Pagination
    $page = isset($_GET['page']) ? max(1, (int)$_GET['page']) : 1;
    $per_page = isset($_GET['per_page']) ? min(50, max(1, (int)$_GET['per_page'])) : 12;
    $offset = ($page - 1) * $per_page;

    // Build base query
    $base_query = "
        FROM products p
        INNER JOIN sellers s ON p.seller_id = s.id
        LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.`order` = 1
        WHERE p.status = 'published'
          AND p.stock > 0
          AND p.category = ?
    ";

    // Initialize params for base conditions
    $params = [$category];
    $types = "s";

    // Add audience filter (only for cultural-clothes)
    if (!empty($audience) && $category === 'cultural-clothes') {
        $valid_audiences = ['men', 'women', 'boy', 'girl'];
        if (in_array($audience, $valid_audiences)) {
            $base_query .= " AND p.audience = ?";
            $params[] = $audience;
            $types .= "s";
        }
    }

    // Add price filters
    if ($min_price !== null) {
        $base_query .= " AND p.price >= ?";
        $params[] = $min_price;
        $types .= "d";
    }
    if ($max_price !== null) {
        $base_query .= " AND p.price <= ?";
        $params[] = $max_price;
        $types .= "d";
    }

    // Add rating filter
    if ($min_rating !== null) {
        $base_query .= " AND p.average_rating >= ?";
        $params[] = $min_rating;
        $types .= "d";
    }

    // Get total count for pagination
    $count_query = "SELECT COUNT(*) as total " . $base_query;
    $count_stmt = $conn->prepare($count_query);
    $count_stmt->bind_param($types, ...$params);
    $count_stmt->execute();
    $total_count = $count_stmt->get_result()->fetch_assoc()['total'];
    $count_stmt->close();

    // Build select query with sorting
    $select_query = "
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
            s.store_name,
            s.store_logo
        " . $base_query;

    // Add sorting
    switch ($sort) {
        case 'price-low':
            $select_query .= " ORDER BY p.price ASC";
            break;
        case 'price-high':
            $select_query .= " ORDER BY p.price DESC";
            break;
        case 'rating':
            $select_query .= " ORDER BY p.average_rating DESC, p.total_reviews DESC";
            break;
        case 'newest':
        default:
            $select_query .= " ORDER BY p.created_at DESC";
            break;
    }

    // Add pagination
    $select_query .= " LIMIT ? OFFSET ?";
    $params[] = $per_page;
    $params[] = $offset;
    $types .= "ii";

    // Execute query
    $stmt = $conn->prepare($select_query);
    $stmt->bind_param($types, ...$params);
    $stmt->execute();
    $result = $stmt->get_result();

    $products = [];
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

        // Get culture info for cultural-clothes
        $culture = null;
        if ($category === 'cultural-clothes') {
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
            'tags' => $tags,
            'created_at' => $row['created_at']
        ];
    }
    $stmt->close();

    // Calculate pagination metadata
    $total_pages = ceil($total_count / $per_page);

    // Return success response
    echo json_encode([
        'success' => true,
        'products' => $products,
        'pagination' => [
            'current_page' => $page,
            'per_page' => $per_page,
            'total_items' => (int)$total_count,
            'total_pages' => (int)$total_pages,
            'has_next' => $page < $total_pages,
            'has_prev' => $page > 1
        ],
        'filters' => [
            'category' => $category,
            'audience' => $audience ?: null,
            'sort' => $sort,
            'min_price' => $min_price,
            'max_price' => $max_price,
            'min_rating' => $min_rating
        ]
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Server error: ' . $e->getMessage()
    ]);
}

$conn->close();
