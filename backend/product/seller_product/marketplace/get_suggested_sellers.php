<?php
require_once __DIR__ . '/../../../config/session_config.php';
include(__DIR__ . "/../../../config/header.php");

/**
 * API: get_suggested_sellers.php
 * 
 * LOGIC SUMMARY:
 * 1. TIERS:
 *    - Tier 1: Sellers with sales this month (Hot Sellers)
 *    - Tier 2: All other active sellers
 * 
 * 2. WEIGHTED SCORE (Internal Sorting):
 *    - avg_rating (40%): Average rating of all their products (Ignoring unrated products).
 *    - total_sales (30%): Lifetime sales volume.
 *    - product_count (30%): Variety of products offered.
 * 
 * 3. LIMITS:
 *    - Min: 3 (if available)
 *    - Max: 10
 */

try {
    $sellers = [];

    $query = "
        SELECT 
            s.id,
            s.store_name,
            s.store_logo AS image,
            s.primary_category AS specialty,
            s.total_sales,
            s.sales_this_month,
            COUNT(p.id) AS products_count,
            COALESCE(AVG(CASE WHEN p.total_reviews > 0 THEN p.average_rating ELSE NULL END), 0) AS seller_avg_rating
        FROM sellers s
        LEFT JOIN products p ON s.id = p.seller_id AND p.status = 'published'
        GROUP BY s.id
        HAVING products_count > 0
        ORDER BY 
            (s.sales_this_month > 0) DESC,
            (
                (s.sales_this_month * 50) +                
                (s.total_sales * 5) +                      
                (COALESCE(AVG(CASE WHEN p.total_reviews > 0 THEN p.average_rating ELSE NULL END), 0) * 10) + 
                (COUNT(p.id) * 0.5)                         
            ) DESC
        LIMIT 10
    ";

    $result = $conn->query($query);

    if (!$result) {
        throw new Exception($conn->error);
    }

    while ($row = $result->fetch_assoc()) {
        $sellers[] = [
            'id' => (int)$row['id'],
            'name' => $row['store_name'] ?: 'Unnamed Store',
            'image' => $row['image'] ?: 'default_store.jpg', // Fallback image
            'specialty' => $row['specialty'] ?: 'Artisanal Goods',
            'rating' => round((float)$row['seller_avg_rating'], 1),
            'products' => (int)$row['products_count'],
            'total_sales' => (int)$row['total_sales'],
            'sales_this_month' => (int)$row['sales_this_month']
        ];
    }

    // Response handling
    if (count($sellers) === 0) {
        echo json_encode([
            'success' => true,
            'sellers' => [],
            'message' => 'No active sellers found to suggest'
        ]);
    } else {
        echo json_encode([
            'success' => true,
            'sellers' => $sellers,
            'count' => count($sellers),
            'message' => count($sellers) < 3 ? 'Found limited top sellers' : 'Suggested sellers loaded successfully'
        ]);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Server error: ' . $e->getMessage()
    ]);
}

$conn->close();
