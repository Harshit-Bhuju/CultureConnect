<?php
session_start();
header('Content-Type: application/json');
include("header.php");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Check if user is logged in
    if (!isset($_SESSION['user_email'])) {
        echo json_encode(["status" => "error", "message" => "User not logged in"]);
        exit;
    }

    $user_email = $_SESSION['user_email'];

    // Fetch user and teacher info
    $stmt = $conn->prepare("SELECT u.id, t.id as teacher_id FROM users u LEFT JOIN teachers t ON u.id = t.user_id WHERE u.email = ? LIMIT 1");
    $stmt->bind_param("s", $user_email);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();
    $stmt->close();

    if (!$user) {
        echo json_encode(["status" => "error", "message" => "User not found"]);
        exit;
    }

    if (!$user['teacher_id']) {
        echo json_encode(["status" => "error", "message" => "No teacher account found"]);
        exit;
    }

    $teacher_id = $user['teacher_id'];

    // Get JSON data
    $json_data = file_get_contents('php://input');
    $data = json_decode($json_data, true);

    $course_id = isset($data['course_id']) ? intval($data['course_id']) : 0;
    $status = isset($data['status']) ? trim($data['status']) : '';

    // Validate inputs
    if ($course_id <= 0) {
        echo json_encode(["status" => "error", "message" => "Invalid course ID"]);
        exit;
    }

    if (!in_array($status, ['draft', 'published'])) {
        echo json_encode(["status" => "error", "message" => "Invalid status. Must be 'draft' or 'published'"]);
        exit;
    }

    // Check if course belongs to this teacher
    $stmt = $conn->prepare("SELECT id FROM teacher_courses WHERE id = ? AND teacher_id = ? LIMIT 1");
    $stmt->bind_param("ii", $course_id, $teacher_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        $stmt->close();
        echo json_encode(["status" => "error", "message" => "Course not found or unauthorized"]);
        exit;
    }
    $stmt->close();

    // Update course status
    $stmt = $conn->prepare("UPDATE teacher_courses SET status = ?, updated_at = NOW() WHERE id = ? AND teacher_id = ?");
    $stmt->bind_param("sii", $status, $course_id, $teacher_id);
    
    if ($stmt->execute()) {
        $stmt->close();
        echo json_encode([
            "status" => "success",
            "message" => $status === 'published' ? "Course published successfully!" : "Course moved to drafts",
            "new_status" => $status
        ]);
    } else {
        $stmt->close();
        echo json_encode(["status" => "error", "message" => "Failed to update course status"]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Invalid request method"]);
}

$conn->close();
exit;
?>