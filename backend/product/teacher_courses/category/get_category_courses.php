<?php

/**
 * Get Category Courses API
 * Fetches courses by category with filtering, sorting, and pagination support
 */

require_once __DIR__ . '/../../../config/session_config.php';
include(__DIR__ . "/../../../config/header.php");

try {
    // Validate required category
    $category = isset($_GET['category']) ? trim($_GET['category']) : '';
    // Allow slug-style or display-style categories
    $valid_categories = ['dance', 'music', 'yoga', 'art', 'language', 'Cultural Dances', 'Cultural Singing', 'Musical Instruments', 'Cultural Art & Crafts'];

    if (empty($category)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Category is required']);
        exit;
    }

    // Get optional filters
    $level = isset($_GET['level']) ? trim($_GET['level']) : '';
    $sort = isset($_GET['sort']) ? trim($_GET['sort']) : 'newest';
    $min_price = isset($_GET['min_price']) && $_GET['min_price'] !== '' ? (float)$_GET['min_price'] : null;
    $max_price = isset($_GET['max_price']) && $_GET['max_price'] !== '' ? (float)$_GET['max_price'] : null;

    // Pagination
    $page = isset($_GET['page']) ? max(1, (int)$_GET['page']) : 1;
    $per_page = isset($_GET['per_page']) ? min(50, max(1, (int)$_GET['per_page'])) : 12;
    $offset = ($page - 1) * $per_page;

    // Build base query
    $base_query = "
        FROM teacher_courses tc
        INNER JOIN teachers t ON tc.teacher_id = t.id
        WHERE tc.status = 'published'
          AND (tc.category = ? OR tc.category LIKE ?)
    ";

    // Initialize params
    $category_param = $category;
    $category_like = "%$category%";
    $params = [$category_param, $category_like];
    $types = "ss";

    // Add level filter
    if (!empty($level) && $level !== 'all') {
        $base_query .= " AND tc.skill_level = ?";
        $params[] = $level;
        $types .= "s";
    }

    // Add price filters
    if ($min_price !== null) {
        $base_query .= " AND tc.price >= ?";
        $params[] = $min_price;
        $types .= "d";
    }
    if ($max_price !== null) {
        $base_query .= " AND tc.price <= ?";
        $params[] = $max_price;
        $types .= "d";
    }

    // Add rating filter
    $ratings = isset($_GET['ratings']) ? $_GET['ratings'] : '';
    if (!empty($ratings)) {
        $rating_list = array_map('intval', explode(',', $ratings));
        if (!empty($rating_list)) {
            $placeholders = implode(',', array_fill(0, count($rating_list), '?'));
            $base_query .= " AND FLOOR(tc.average_rating) IN ($placeholders)";
            foreach ($rating_list as $rating) {
                $params[] = $rating;
                $types .= "i";
            }
        }
    }

    // Get total count
    $count_query = "SELECT COUNT(*) as total " . $base_query;
    $count_stmt = $conn->prepare($count_query);
    $count_stmt->bind_param($types, ...$params);
    $count_stmt->execute();
    $total_count = $count_stmt->get_result()->fetch_assoc()['total'];
    $count_stmt->close();

    // Build select query
    $select_query = "
        SELECT 
            tc.id,
            tc.teacher_id,
            tc.course_title AS title,
            tc.description,
            tc.price,
            tc.category,
            tc.skill_level AS level,
            tc.average_rating AS rating,
            tc.total_reviews AS reviews,
            tc.thumbnail AS image,
            tc.created_at,
            t.teacher_name,
            t.profile_picture AS teacher_image,
            (SELECT COUNT(*) FROM teacher_course_enroll WHERE course_id = tc.id) AS enrolled_students
        " . $base_query;

    // Add sorting
    switch ($sort) {
        case 'price-low':
            $select_query .= " ORDER BY tc.price ASC";
            break;
        case 'price-high':
            $select_query .= " ORDER BY tc.price DESC";
            break;
        case 'rating':
            $select_query .= " ORDER BY tc.average_rating DESC, tc.total_reviews DESC";
            break;
        case 'popular':
            $select_query .= " ORDER BY enrolled_students DESC, tc.average_rating DESC";
            break;
        case 'newest':
        default:
            $select_query .= " ORDER BY tc.created_at DESC";
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

    $courses = [];
    while ($row = $result->fetch_assoc()) {
        $courses[] = [
            'id' => (int)$row['id'],
            'teacherId' => (int)$row['teacher_id'],
            'teacher_name' => $row['teacher_name'],
            'teacher_image' => $row['teacher_image'],
            'title' => $row['title'],
            'description' => $row['description'],
            'price' => (float)$row['price'],
            'category' => $row['category'],
            'level' => ucfirst($row['level']),
            'image' => $row['image'],
            'average_rating' => (float)$row['rating'],
            'rating' => (float)$row['rating'],
            'reviews' => (int)$row['reviews'],
            'enrolled_students' => (int)$row['enrolled_students'],
            'created_at' => $row['created_at']
        ];
    }
    $stmt->close();

    echo json_encode([
        'success' => true,
        'courses' => $courses,
        'pagination' => [
            'total_items' => (int)$total_count,
            'total_pages' => ceil($total_count / $per_page),
            'has_next' => $page < ceil($total_count / $per_page),
            'has_prev' => $page > 1
        ]
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}

$conn->close();
