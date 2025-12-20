<?php
session_start();
include("header.php");

// Get teacher_id from URL parameter
$teacher_id = isset($_GET['teacher_id']) ? intval($_GET['teacher_id']) : null;

if (!$teacher_id) {
    // If no teacher_id in URL, try to get from session
    if (!isset($_SESSION['user_email'])) {
        echo json_encode(["status" => "error", "message" => "User not logged in"]);
        exit;
    }

    $user_email = $_SESSION['user_email'];

    // Get user_id from email
    $stmt = $conn->prepare("SELECT id FROM users WHERE email = ? LIMIT 1");
    $stmt->bind_param("s", $user_email);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();
    $stmt->close();

    if (!$user) {
        echo json_encode(["status" => "error", "message" => "User not found"]);
        exit;
    }

    $user_id = $user['id'];

    // Get teacher_id from user_id
    $stmt = $conn->prepare("SELECT id FROM teachers WHERE user_id = ? LIMIT 1");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $teacher = $result->fetch_assoc();
    $stmt->close();

    if ($teacher) {
        $teacher_id = $teacher['id'];
    }
}

if (!$teacher_id) {
    echo json_encode(["status" => "error", "message" => "Teacher ID not provided"]);
    exit;
}

// Fetch teacher profile
$stmt = $conn->prepare("SELECT * FROM teachers WHERE id = ? LIMIT 1");
$stmt->bind_param("i", $teacher_id);
$stmt->execute();
$result = $stmt->get_result();
$teacher_profile = $result->fetch_assoc();
$stmt->close();

if (!$teacher_profile) {
    echo json_encode([
        "status" => "error",
        "message" => "Teacher profile not found"
    ]);
    exit;
}

// Format created_at date
$created_at = $teacher_profile["created_at"];
$formatted_created_at = date("F Y", strtotime($created_at));

// Fetch all courses for this teacher
$courses_stmt = $conn->prepare("
    SELECT 
        id,
        course_title,
        category,
        price,
        duration_weeks,
        description,
        thumbnail,
        total_enrollments,
        total_videos,
        average_rating,
        created_at,
        status
    FROM teacher_courses
    WHERE teacher_id = ? AND status = 'published'
    ORDER BY created_at DESC
");
$courses_stmt->bind_param("i", $teacher_id);
$courses_stmt->execute();
$courses_result = $courses_stmt->get_result();

$courses = [];
while ($course = $courses_result->fetch_assoc()) {
    $duration_display = $course['duration_weeks'] 
        ? $course['duration_weeks'] . ' weeks' 
        : 'Self-paced';

    $courses[] = [
        'id' => (int)$course['id'],
        'title' => $course['course_title'],
        'image' => $course['thumbnail'],
        'price' => (float)$course['price'],
        'video_count' => (int)$course['total_videos'],
        'duration' => $duration_display,
        'enrolled_students' => (int)$course['total_enrollments'],
        'average_rating' => (float)$course['average_rating'],
        'description' => $course['description'],
        'category' => $course['category'],
        'status' => $course['status'] === 'published' ? 'Active' : 'Draft'
    ];
}
$courses_stmt->close();

// Build response
$response = [
    "status" => "success",
    "teacher_profile" => [
        "id" => (int)$teacher_profile["id"],
        "name" => $teacher_profile["teacher_name"],
        "bio" => $teacher_profile["bio"],
        "category" => $teacher_profile["primary_category"],
        "esewa_phone" => $teacher_profile["esewa_phone"],
        "profile_picture" => $teacher_profile["profile_picture"],
        "status" => $teacher_profile["status"],
        "followers_count" => (int)$teacher_profile["followers"],
        "total_courses" => (int)$teacher_profile["total_courses"],
        "total_revenue" => (float)$teacher_profile["total_revenue"],
        "created_at" => $formatted_created_at
    ],
    "classes" => $courses
];

echo json_encode($response);

$conn->close();
exit;