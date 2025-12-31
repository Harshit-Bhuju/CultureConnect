<?php
session_start();
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
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
        "message" => "User not logged in",
        "is_enrolled" => false
    ]);
    exit;
}

$user_email = $_SESSION['user_email'];
$course_id = isset($_GET['course_id']) ? intval($_GET['course_id']) : null;

if (!$course_id) {
    echo json_encode([
        "status" => "error",
        "message" => "Course ID is required"
    ]);
    exit;
}

try {
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
            "message" => "User not found",
            "is_enrolled" => false
        ]);
        exit;
    }

    $user_id = $user['id'];

    // Check enrollment status
    $stmt = $conn->prepare("
        SELECT 
            id,
            completion_status,
            payment_status,
            progress_percentage,
            enrollment_date
        FROM teacher_students 
        WHERE course_id = ? AND student_id = ? 
        LIMIT 1
    ");
    $stmt->bind_param("ii", $course_id, $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $enrollment = $result->fetch_assoc();
    $stmt->close();

    if ($enrollment) {
        echo json_encode([
            "status" => "success",
            "is_enrolled" => true,
            "enrollment" => [
                "id" => (int)$enrollment['id'],
                "completion_status" => $enrollment['completion_status'],
                "payment_status" => $enrollment['payment_status'],
                "progress_percentage" => (float)$enrollment['progress_percentage'],
                "enrollment_date" => $enrollment['enrollment_date']
            ]
        ]);
    } else {
        echo json_encode([
            "status" => "success",
            "is_enrolled" => false
        ]);
    }
} catch (Exception $e) {
    echo json_encode([
        "status" => "error",
        "message" => "Failed to check enrollment: " . $e->getMessage(),
        "is_enrolled" => false
    ]);
}

$conn->close();
exit;
