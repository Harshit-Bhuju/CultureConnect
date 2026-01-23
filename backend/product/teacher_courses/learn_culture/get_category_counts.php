<?php

/**
 * Get Category Counts API
 * Returns the number of published courses in each category
 */

require_once __DIR__ . '/../../../config/session_config.php';
include(__DIR__ . "/../../../config/header.php");

try {
    $query = "
        SELECT category, COUNT(*) as count 
        FROM teacher_courses 
        WHERE status = 'published' 
        GROUP BY category
    ";

    $result = $conn->query($query);
    $counts = [];

    while ($row = $result->fetch_assoc()) {
        $counts[$row['category']] = (int)$row['count'];
    }

    echo json_encode(['success' => true, 'counts' => $counts]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}

$conn->close();
