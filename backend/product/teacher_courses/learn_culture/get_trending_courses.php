<?php

/**
 * Get Trending Courses API
 * Returns courses with most enrollments in a given period (month, 3 months, year)
 */

require_once __DIR__ . '/../../../config/session_config.php';
include(__DIR__ . "/../../../config/header.php");

try {
    $period = isset($_GET['period']) ? $_GET['period'] : 'month'; // month, 3months, year
    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;

    $date_filter = "";
    switch ($period) {
        case '3months':
            $date_filter = "AND tce.enrolled_at >= DATE_SUB(NOW(), INTERVAL 3 MONTH)";
            break;
        case 'year':
            $date_filter = "AND tce.enrolled_at >= DATE_SUB(NOW(), INTERVAL 1 YEAR)";
            break;
        case 'month':
        default:
            $date_filter = "AND tce.enrolled_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH)";
            break;
    }

    $query = "
        SELECT 
            tc.id,
            tc.teacher_id,
            tc.course_title AS title,
            tc.price,
            tc.category,
            tc.skill_level AS level,
            tc.average_rating AS rating,
            tc.total_reviews AS reviews,
            tc.thumbnail AS image,
            t.teacher_name,
            COUNT(tce.id) AS recent_enrollments
        FROM teacher_courses tc
        INNER JOIN teachers t ON tc.teacher_id = t.id
        LEFT JOIN teacher_course_enroll tce ON tc.id = tce.course_id $date_filter
        WHERE tc.status = 'published'
        GROUP BY tc.id
        ORDER BY recent_enrollments DESC, tc.average_rating DESC
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
            'price' => (float)$row['price'],
            'category' => $row['category'],
            'level' => ucfirst($row['level']),
            'image' => $row['image'],
            'rating' => (float)$row['rating'],
            'reviews' => (int)$row['reviews'],
            'recent_enrollments' => (int)$row['recent_enrollments']
        ];
    }
    $stmt->close();

    echo json_encode(['success' => true, 'courses' => $courses, 'period' => $period]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}

$conn->close();
