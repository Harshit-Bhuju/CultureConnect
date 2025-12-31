<?php
session_start();
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include("header.php");

// Check if user is logged in
if (!isset($_SESSION['user_email'])) {
    echo json_encode([
        "status" => "error",
        "message" => "User not logged in"
    ]);
    exit;
}

// Get JSON input
$json_input = file_get_contents('php://input');
$data = json_decode($json_input, true);

$course_id = isset($data['course_id']) ? intval($data['course_id']) : null;

if (!$course_id) {
    echo json_encode([
        "status" => "error",
        "message" => "Course ID is required"
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

    // Get course details
    $stmt = $conn->prepare("
        SELECT 
            tc.id,
            tc.price,
            tc.teacher_id,
            COUNT(ts.id) as current_enrollments
        FROM teacher_courses tc
        LEFT JOIN teacher_students ts ON tc.id = ts.course_id
        WHERE tc.id = ?
        GROUP BY tc.id
        LIMIT 1
    ");
    $stmt->bind_param("i", $course_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $course = $result->fetch_assoc();
    $stmt->close();

    if (!$course) {
        echo json_encode([
            "status" => "error",
            "message" => "Course not found"
        ]);
        exit;
    }

    // Check if course is free
    if ($course['price'] > 0) {
        echo json_encode([
            "status" => "error",
            "message" => "This course requires payment. Please proceed to checkout."
        ]);
        exit;
    }

    // Check if already enrolled
    $stmt = $conn->prepare("
        SELECT id FROM teacher_students 
        WHERE course_id = ? AND student_id = ? 
        LIMIT 1
    ");
    $stmt->bind_param("ii", $course_id, $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $existing_enrollment = $result->fetch_assoc();
    $stmt->close();

    if ($existing_enrollment) {
        echo json_encode([
            "status" => "error",
            "message" => "You are already enrolled in this course"
        ]);
        exit;
    }

    // Enroll the student
    $stmt = $conn->prepare("
        INSERT INTO teacher_students 
        (course_id, student_id, enrollment_date, completion_status, payment_status, paid_amount, progress_percentage)
        VALUES (?, ?, NOW(), 'enrolled', 'free', 0.00, 0.00)
    ");
    $stmt->bind_param("ii", $course_id, $user_id);

    if ($stmt->execute()) {
        $enrollment_id = $stmt->insert_id;
        $stmt->close();

        // Update course total_enrollments
        $update_stmt = $conn->prepare("
            UPDATE teacher_courses 
            SET total_enrollments = total_enrollments + 1 
            WHERE id = ?
        ");
        $update_stmt->bind_param("i", $course_id);
        $update_stmt->execute();
        $update_stmt->close();

        // Update teacher's total courses count if needed
        $teacher_id = $course['teacher_id'];
        $update_teacher = $conn->prepare("
            UPDATE teachers 
            SET enrollments_this_month = enrollments_this_month + 1,
                enrollments_this_year = enrollments_this_year + 1
            WHERE id = ?
        ");
        $update_teacher->bind_param("i", $teacher_id);
        $update_teacher->execute();
        $update_teacher->close();

        echo json_encode([
            "status" => "success",
            "message" => "Successfully enrolled in the course!",
            "enrollment_id" => $enrollment_id
        ]);
    } else {
        echo json_encode([
            "status" => "error",
            "message" => "Failed to enroll in course: " . $stmt->error
        ]);
        $stmt->close();
    }
} catch (Exception $e) {
    echo json_encode([
        "status" => "error",
        "message" => "Failed to process enrollment: " . $e->getMessage()
    ]);
}

$conn->close();
exit;
