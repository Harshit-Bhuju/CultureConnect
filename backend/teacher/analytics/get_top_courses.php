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

    // Build query based on period
    if ($period === "This month") {
        $query = "
            SELECT 
                tc.id,
                tc.course_title as title,
                tc.thumbnail as image,
                COALESCE(tcss.sales_count, 0) as students,
                tc.average_rating as rating,
                tc.price,
                COALESCE(tcss.revenue, 0) as revenue
            FROM teacher_courses tc
            LEFT JOIN teacher_course_sales_stats tcss ON tc.id = tcss.course_id 
                AND DATE_FORMAT(tcss.month, '%Y-%m') = DATE_FORMAT(NOW(), '%Y-%m')
            WHERE tc.teacher_id = ? AND tc.status = 'published'
            AND COALESCE(tcss.sales_count, 0) > 0
            ORDER BY revenue DESC, students DESC
            LIMIT 20
        ";
    } elseif ($period === "This year") {
        $query = "
            SELECT 
                tc.id,
                tc.course_title as title,
                tc.thumbnail as image,
                COALESCE(SUM(tcss.sales_count), 0) as students,
                tc.average_rating as rating,
                tc.price,
                COALESCE(SUM(tcss.revenue), 0) as revenue
            FROM teacher_courses tc
            LEFT JOIN teacher_course_sales_stats tcss ON tc.id = tcss.course_id 
                AND YEAR(tcss.month) = YEAR(NOW())
            WHERE tc.teacher_id = ? AND tc.status = 'published'
            GROUP BY tc.id
            HAVING students > 0
            ORDER BY revenue DESC, students DESC
            LIMIT 20
        ";
    } else {
        // "Until now" - use cached columns
        $query = "
            SELECT 
                id,
                course_title as title,
                thumbnail as image,
                total_sales as students,
                average_rating as rating,
                price,
                revenue
            FROM teacher_courses
            WHERE teacher_id = ? AND status = 'published'
            AND total_sales > 0
            ORDER BY revenue DESC, students DESC
            LIMIT 20
        ";
    }

    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $teacher_id);
    $stmt->execute();
    $result = $stmt->get_result();

    $top_courses = [];
    while ($course = $result->fetch_assoc()) {
        $top_courses[] = [
            'id' => (int)$course['id'],
            'title' => $course['title'],
            'image' => $course['image'],
            'students' => (int)$course['students'],
            'rating' => round((float)$course['rating'], 1),
            'revenue' => (float)$course['revenue'],
            'price' => (float)$course['price']
        ];
    }
    $stmt->close();

    echo json_encode([
        'success' => true,
        'top_courses' => $top_courses
    ]);
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}

$conn->close();
