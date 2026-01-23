<?php

/**
 * Get Popular Courses API
 * Returns top-rated and most enrolled courses
 */

require_once __DIR__ . '/../../../config/session_config.php';
include(__DIR__ . "/../../../config/header.php");

try {
    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;

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
            (SELECT COUNT(*) FROM teacher_course_enroll WHERE course_id = tc.id) AS enrolled_students
        FROM teacher_courses tc
        INNER JOIN teachers t ON tc.teacher_id = t.id
        WHERE tc.status = 'published'
        ORDER BY enrolled_students DESC, tc.average_rating DESC
        LIMIT ?
    ";

    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $limit);
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
            'rating' => (float)$row['rating'],
            'reviews' => (int)$row['reviews'],
            'enrolled_students' => (int)$row['enrolled_students']
        ];
    }
    $stmt->close();

    echo json_encode(['success' => true, 'courses' => $courses]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}

$conn->close();
