<?php
require_once __DIR__ . '/../../config/session_config.php';
include("../../config/header.php");

try {
    if (!isset($_SESSION['user_email'])) {
        echo json_encode(["success" => false, "error" => "User not logged in"]);
        exit;
    }

    // Priority: teacher_id from GET, then from session
    $requested_teacher_id = isset($_GET['teacher_id']) ? intval($_GET['teacher_id']) : null;

    // Get session's teacher_id for security
    $stmt = $conn->prepare("
        SELECT u.role, t.id as teacher_id 
        FROM users u 
        LEFT JOIN teachers t ON u.id = t.user_id 
        WHERE u.email = ? 
        LIMIT 1
    ");
    $stmt->bind_param("s", $_SESSION['user_email']);
    $stmt->execute();
    $session_user = $stmt->get_result()->fetch_assoc();
    $stmt->close();

    if (!$session_user) {
        echo json_encode(["success" => false, "error" => "User record not found"]);
        exit;
    }

    $teacher_id = null;
    if ($session_user['role'] === 'admin' && $requested_teacher_id) {
        $teacher_id = $requested_teacher_id;
    } elseif ($requested_teacher_id) {
        // Security check: normal teachers can only see their own stats
        if ($session_user['teacher_id'] && $requested_teacher_id == $session_user['teacher_id']) {
            $teacher_id = $requested_teacher_id;
        } else {
            echo json_encode(["success" => false, "error" => "Unauthorized access to these statistics"]);
            exit;
        }
    } else {
        $teacher_id = $session_user['teacher_id'];
    }

    if (!$teacher_id) {
        echo json_encode(["success" => false, "error" => "No teacher account found"]);
        exit;
    }

    // Get period from request (default: "This month")
    $period = isset($_GET['period']) ? $_GET['period'] : 'This month';

    // Fetch cached stats from teachers table based on period
    $stmt = $conn->prepare("
        SELECT 
            CASE 
                WHEN ? = 'This month' THEN sales_this_month
                WHEN ? = 'This year' THEN sales_this_year
                ELSE total_sales
            END as total_students,
            CASE 
                WHEN ? = 'This month' THEN revenue_this_month
                WHEN ? = 'This year' THEN revenue_this_year
                ELSE total_revenue
            END as total_revenue,
            total_courses,
            followers
        FROM teachers
        WHERE id = ?
    ");

    $stmt->bind_param("ssssi", $period, $period, $period, $period, $teacher_id);
    $stmt->execute();
    $teacher_stats = $stmt->get_result()->fetch_assoc();
    $stmt->close();

    // Get course statistics
    $course_stmt = $conn->prepare("
        SELECT 
            COUNT(CASE WHEN status = 'published' THEN 1 END) as active_courses,
            COUNT(CASE WHEN status = 'draft' THEN 1 END) as draft_courses,
            COUNT(CASE WHEN status = 'deleted' THEN 1 END) as deleted_courses,
            COUNT(*) as total_courses_calc,
            COALESCE(AVG(average_rating), 0) as average_rating
        FROM teacher_courses
        WHERE teacher_id = ?
    ");

    $course_stmt->bind_param("i", $teacher_id);
    $course_stmt->execute();
    $course_result = $course_stmt->get_result();
    $course_data = $course_result->fetch_assoc();
    $course_stmt->close();

    echo json_encode([
        'success' => true,
        'period' => $period,
        'stats' => [
            'total_revenue' => (float)$teacher_stats['total_revenue'],
            'total_students' => (int)$teacher_stats['total_students'],
            'total_courses' => (int)$teacher_stats['total_courses'],
            'average_rating' => round((float)$course_data['average_rating'], 1),
            'followers' => (int)$teacher_stats['followers']
        ],
        'course_stats' => [
            'active_courses' => (int)$course_data['active_courses'],
            'draft_courses' => (int)$course_data['draft_courses'],
            'deleted_courses' => (int)$course_data['deleted_courses'],
            'total_courses' => (int)$course_data['total_courses_calc']
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
