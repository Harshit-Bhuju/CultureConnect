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

    // Date filter
    $date_filter = "";
    if ($period === 'This month') {
        $date_filter = "AND ts.enrollment_date >= DATE_FORMAT(NOW() ,'%Y-%m-01')";
    } elseif ($period === 'This year') {
        $date_filter = "AND ts.enrollment_date >= DATE_FORMAT(NOW() ,'%Y-01-01')";
    }

    // Course Filter
    $course_id = isset($_GET['course_id']) ? intval($_GET['course_id']) : null;
    $course_filter = $course_id ? "AND tc.id = ?" : "";

    // Get enrollments for teacher's courses
    $query = "
        SELECT
            ts.id,
            u.username as student_name,
            u.profile_pic as student_avatar,
            tc.course_title,
            tc.id as course_id,
            COALESCE(tcp.amount, 0) as amount,
            tcp.transaction_uuid,
            tcp.payment_method,
            ts.enrollment_date as date,
            ts.payment_status
        FROM teacher_course_enroll ts
        JOIN teacher_courses tc ON ts.course_id = tc.id
        JOIN users u ON ts.student_id = u.id
        LEFT JOIN teacher_course_payment tcp ON ts.id = tcp.enrollment_id AND tcp.payment_status = 'success'
        WHERE tc.teacher_id = ?
        $date_filter
        $course_filter
        ORDER BY ts.enrollment_date DESC
    ";

    $stmt = $conn->prepare($query);

    if ($course_id) {
        $stmt->bind_param("ii", $teacher_id, $course_id);
    } else {
        $stmt->bind_param("i", $teacher_id);
    }

    $stmt->execute();
    $result = $stmt->get_result();

    $enrollments = [];
    while ($enrollment = $result->fetch_assoc()) {
        // Format date
        $date = date("Y-m-d", strtotime($enrollment['date']));


        $enrollments[] = [
            'id' => (string)$enrollment['id'],
            'student_name' => $enrollment['student_name'],
            'student_avatar' => $enrollment['student_avatar'],
            'course_title' => $enrollment['course_title'],
            'course_id' => (int)$enrollment['course_id'],
            'amount' => (float)$enrollment['amount'],
            'transaction_uuid' => $enrollment['transaction_uuid'],
            'payment_method' => $enrollment['payment_method'],
            'date' => $date,
            'status' => $enrollment['payment_status'],
            'payment_status' => $enrollment['payment_status']
        ];
    }
    $stmt->close();

    echo json_encode([
        'success' => true,
        'enrollments' => $enrollments
    ]);
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}

$conn->close();
