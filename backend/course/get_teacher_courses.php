<?php
require_once __DIR__ . '/../config/session_config.php';
include("../config/header.php");

try {
    if (!isset($_SESSION['user_email'])) {
        echo json_encode(["success" => false, "error" => "User not logged in"]);
        exit;
    }

    $user_email = $_SESSION['user_email'];

    // Get user's teacher_id
    $stmt = $conn->prepare("
        SELECT u.id, t.id as teacher_id 
        FROM users u 
        LEFT JOIN teachers t ON u.id = t.user_id 
        WHERE u.email = ? 
        LIMIT 1
    ");
    $stmt->bind_param("s", $user_email);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();
    $stmt->close();

    if (!$user || !$user['teacher_id']) {
        echo json_encode(["success" => false, "error" => "No teacher account found"]);
        exit;
    }

    $teacher_id = $user['teacher_id'];

    // Fetch all courses for this teacher
    $stmt = $conn->prepare("
        SELECT 
            tc.id,
            tc.course_title as title,
            tc.category,
            tc.skill_level as level,
            tc.price,
            tc.duration_weeks,
            tc.description,
            tc.thumbnail as image,
            tc.total_sales as enrolled_students,
            tc.total_videos as video_count,
            tc.average_rating as rating,
            tc.status,
            tc.created_at as createdAt,
            tc.updated_at as updatedAt
        FROM teacher_courses tc
        WHERE tc.teacher_id = ? AND tc.status != 'deleted'
        ORDER BY tc.created_at DESC
    ");

    $stmt->bind_param("i", $teacher_id);
    $stmt->execute();
    $result = $stmt->get_result();

    $courses = [];
    while ($course = $result->fetch_assoc()) {
        $duration_display = $course['duration_weeks']
            ? $course['duration_weeks'] . ' weeks'
            : 'Self-paced';

        $courses[] = [
            'id' => (string)$course['id'],
            'title' => $course['title'],
            'image' => $course['image'],
            'category' => ucfirst($course['category']),
            'status' => $course['status'] === 'published' ? 'Published' : ucfirst($course['status']),
            'price' => (float)$course['price'],
            'stock' => 100, // Conceptual seats (unlimited for now)
            'enrolled_students' => (int)$course['enrolled_students'],
            'rating' => (float)$course['rating'],
            'createdAt' => $course['createdAt'],
            'updatedAt' => $course['updatedAt'],
            'duration' => $duration_display,
            'level' => ucfirst($course['level']),
            'video_count' => (int)$course['video_count']
        ];
    }
    $stmt->close();

    // Calculate stats
    $active = 0;
    $drafts = 0;
    $totalStudents = 0;
    $ratings = [];

    foreach ($courses as $course) {
        if ($course['status'] === 'Published') $active++;
        if ($course['status'] === 'Draft') $drafts++;
        $totalStudents += $course['enrolled_students'];
        if ($course['rating'] > 0) $ratings[] = $course['rating'];
    }

    $avgRating = count($ratings) > 0
        ? round(array_sum($ratings) / count($ratings), 1)
        : 0;

    echo json_encode([
        'success' => true,
        'courses' => $courses,
        'stats' => [
            'totalCourses' => count($courses),
            'activeCourses' => $active,
            'draftCourses' => $drafts,
            'totalStudents' => $totalStudents,
            'averageRating' => $avgRating
        ]
    ]);
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}

$conn->close();
