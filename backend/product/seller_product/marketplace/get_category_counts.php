<?php
require_once __DIR__ . '/../../../config/session_config.php';
include(__DIR__ . "/../../../config/header.php");

/**
 * API: get_category_counts.php
 * 
 * Returns the total number of published products for each main category.
 */

try {
    $counts = [
        'cultural-clothes' => 0,
        'musical-instruments' => 0,
        'handicraft-decors' => 0
    ];

    $query = "
        SELECT category, COUNT(*) as product_count 
        FROM products 
        WHERE status = 'published' 
        GROUP BY category
    ";

    $result = $conn->query($query);

    if (!$result) {
        throw new Exception($conn->error);
    }

    while ($row = $result->fetch_assoc()) {
        $cat = $row['category'];
        if (array_key_exists($cat, $counts)) {
            $counts[$cat] = (int)$row['product_count'];
        }
    }

    echo json_encode([
        'success' => true,
        'counts' => $counts,
        'message' => 'Category counts fetched successfully'
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Server error: ' . $e->getMessage()
    ]);
}

$conn->close();
