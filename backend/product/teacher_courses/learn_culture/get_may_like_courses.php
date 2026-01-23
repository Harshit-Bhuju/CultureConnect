<?php

/**
 * Get May Like Courses API
 * Returns suggested courses based on category or popularity with scoring logic
 */

require_once __DIR__ . '/../../../config/session_config.php';
include(__DIR__ . "/../../../config/header.php");

try {
    $category = isset($_GET['category']) ? trim($_GET['category']) : '';
    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 100;
    $exclude_id = isset($_GET['exclude_id']) ? (int)$_GET['exclude_id'] : 0;

    // Scoring logic similar to Marketplace
    // 1. Enrolled students weight (x10)
    // 2. Rating weight (Rating * Reviews * 0.5)
    // 3. Freshness Boost (+10 if < 30 days old)
    $query = "
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
            t.teacher_name,
            (SELECT COUNT(*) FROM teacher_course_enroll WHERE course_id = tc.id) AS enrolled_students,
            (
                ((SELECT COUNT(*) FROM teacher_course_enroll WHERE course_id = tc.id) * 10) +
                (COALESCE(tc.average_rating, 0) * COALESCE(tc.total_reviews, 1) * 0.5) +
                (CASE WHEN tc.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 10 ELSE 0 END)
            ) AS popularity_score
        FROM teacher_courses tc
        INNER JOIN teachers t ON tc.teacher_id = t.id
        WHERE tc.status = 'published'
          AND tc.id != ?
    ";

    if (!empty($category)) {
        $query .= " AND (tc.category = ? OR tc.category LIKE ?)";
    }

    $query .= " ORDER BY popularity_score DESC, tc.created_at DESC LIMIT ?";

    $stmt = $conn->prepare($query);

    if (!empty($category)) {
        $cat_param = $category;
        $cat_like = "%$category%";
        $stmt->bind_param("issi", $exclude_id, $cat_param, $cat_like, $limit);
    } else {
        $stmt->bind_param("ii", $exclude_id, $limit);
    }

    $stmt->execute();
    $result = $stmt->get_result();

    $courses = [];
    while ($row = $result->fetch_assoc()) {
        $courses[] = [
            'id' => (int)$row['id'],
            'teacherId' => (int)$row['teacher_id'],
            'teacher_name' => $row['teacher_name'],
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
            'popularity_score' => (float)$row['popularity_score']
        ];
    }
    $stmt->close();

    echo json_encode(['success' => true, 'courses' => $courses]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}

$conn->close();
