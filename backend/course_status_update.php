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
$new_status = isset($data['status']) ? strtolower(trim($data['status'])) : null;

if (!$course_id || !$new_status) {
    echo json_encode([
        "status" => "error",
        "message" => "Course ID and status are required"
    ]);
    exit;
}

// Validate status
$valid_statuses = ['draft', 'published', 'archived'];
if (!in_array($new_status, $valid_statuses)) {
    echo json_encode([
        "status" => "error",
        "message" => "Invalid status. Must be: draft, published, or archived"
    ]);
    exit;
}

try {
    $user_email = $_SESSION['user_email'];

    // Get user_id and verify they are the course owner
    $stmt = $conn->prepare("
        SELECT u.id as user_id, t.id as teacher_id
        FROM users u
        INNER JOIN teachers t ON u.id = t.user_id
        WHERE u.email = ?
        LIMIT 1
    ");
    $stmt->bind_param("s", $user_email);
    $stmt->execute();
    $result = $stmt->get_result();
    $user_data = $result->fetch_assoc();
    $stmt->close();

    if (!$user_data) {
        echo json_encode([
            "status" => "error",
            "message" => "Teacher account not found"
        ]);
        exit;
    }

    $teacher_id = $user_data['teacher_id'];

    // Verify the course belongs to this teacher
    $stmt = $conn->prepare("
        SELECT id, status 
        FROM teacher_courses 
        WHERE id = ? AND teacher_id = ?
        LIMIT 1
    ");
    $stmt->bind_param("ii", $course_id, $teacher_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $course = $result->fetch_assoc();
    $stmt->close();

    if (!$course) {
        echo json_encode([
            "status" => "error",
            "message" => "Course not found or you don't have permission to modify it"
        ]);
        exit;
    }

    $old_status = $course['status'];

    // Update the course status
    $stmt = $conn->prepare("
        UPDATE teacher_courses 
        SET status = ?, updated_at = NOW()
        WHERE id = ? AND teacher_id = ?
    ");
    $stmt->bind_param("sii", $new_status, $course_id, $teacher_id);

    if ($stmt->execute()) {
        $stmt->close();

        // If publishing, update teacher's total_courses count
        if ($new_status === 'published' && $old_status !== 'published') {
            $update_teacher = $conn->prepare("
                UPDATE teachers 
                SET total_courses = (
                    SELECT COUNT(*) 
                    FROM teacher_courses 
                    WHERE teacher_id = ? AND status = 'published'
                )
                WHERE id = ?
            ");
            $update_teacher->bind_param("ii", $teacher_id, $teacher_id);
            $update_teacher->execute();
            $update_teacher->close();
        }

        // If unpublishing, update teacher's total_courses count
        if ($new_status !== 'published' && $old_status === 'published') {
            $update_teacher = $conn->prepare("
                UPDATE teachers 
                SET total_courses = (
                    SELECT COUNT(*) 
                    FROM teacher_courses 
                    WHERE teacher_id = ? AND status = 'published'
                )
                WHERE id = ?
            ");
            $update_teacher->bind_param("ii", $teacher_id, $teacher_id);
            $update_teacher->execute();
            $update_teacher->close();
        }

        $status_messages = [
            'draft' => 'Course moved to drafts',
            'published' => 'Course published successfully',
            'archived' => 'Course archived'
        ];

        echo json_encode([
            "status" => "success",
            "message" => $status_messages[$new_status],
            "new_status" => $new_status
        ]);
    } else {
        echo json_encode([
            "status" => "error",
            "message" => "Failed to update course status: " . $stmt->error
        ]);
        $stmt->close();
    }
} catch (Exception $e) {
    echo json_encode([
        "status" => "error",
        "message" => "Failed to update status: " . $e->getMessage()
    ]);
}

$conn->close();
exit;
