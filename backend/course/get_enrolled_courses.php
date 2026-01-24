<?php
require_once __DIR__ . '/../config/session_config.php';
include("../config/header.php");

// Check if user is logged in
if (!isset($_SESSION['user_email'])) {
    echo json_encode([
        "status" => "error",
        "message" => "User not logged in"
    ]);
    exit;
}

try {
    $user_email = $_SESSION['user_email'];

    // Get user_id from email
    $stmt = $conn->prepare("SELECT id FROM users WHERE email = ? LIMIT 1");
    $stmt->bind_param("s", $user_email);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();
    $stmt->close();

    if (!$user) {
        echo json_encode([
            "status" => "error",
            "message" => "User not found"
        ]);
        exit;
    }

    $user_id = $user['id'];

    // Fetch enrolled courses with teacher and progress info
    $query = "
        SELECT 
            tc.id,
            tc.course_title as title,
            tc.category,
            tc.thumbnail,
            tc.average_rating as averageRating,
            tc.total_reviews as totalReviews,
            t.teacher_name as teacherName,
            t.id as teacherId,
            tce.payment_status,
            (SELECT COUNT(*) FROM teacher_videos WHERE course_id = tc.id) as totalVideos,
            (SELECT COUNT(*) FROM student_course_progress 
             WHERE user_id = ? AND course_id = tc.id AND completed_at IS NOT NULL) as completedVideos
        FROM teacher_course_enroll tce
        JOIN teacher_courses tc ON tce.course_id = tc.id
        JOIN teachers t ON tc.teacher_id = t.id
        WHERE tce.student_id = ? AND (tce.payment_status = 'paid' OR tce.payment_status = 'free')
        ORDER BY tce.enrollment_date DESC
    ";

    $stmt = $conn->prepare($query);
    $stmt->bind_param("ii", $user_id, $user_id);
    $stmt->execute();
    $result = $stmt->get_result();

    $courses = [];
    while ($row = $result->fetch_assoc()) {
        $total = (int)$row['totalVideos'];
        $completed = (int)$row['completedVideos'];
        $progress = ($total > 0) ? round(($completed / $total) * 100) : 0;

        $row['progress'] = $progress;
        $row['totalVideos'] = $total;
        $row['completedVideos'] = $completed;
        $row['id'] = (int)$row['id'];
        $row['teacherId'] = (int)$row['teacherId'];
        $row['averageRating'] = (float)$row['averageRating'];

        // Handle thumbnail path
        // Frontend expects just the filename and will prepend the base URL
        $row['thumbnail'] = $row['thumbnail'] ?: null;

        $courses[] = $row;
    }
    $stmt->close();

    echo json_encode([
        "status" => "success",
        "courses" => $courses
    ]);
} catch (Exception $e) {
    echo json_encode([
        "status" => "error",
        "message" => "Failed to fetch enrolled courses: " . $e->getMessage()
    ]);
}

$conn->close();
exit;
