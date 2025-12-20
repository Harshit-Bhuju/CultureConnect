<?php
session_start();
include("header.php");

if (!isset($_SESSION['user_email'])) {
    echo json_encode([
        "status" => "error",
        "message" => "User not logged in"
    ]);
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
    echo json_encode([
        "status" => "error",
        "message" => "User not found"
    ]);
    exit;
}

$user_id = $user['id'];

// Get all teachers this user follows
$query = "
    SELECT 
        t.id,
        t.teacher_name,
        t.bio,
        t.primary_category,
        t.profile_picture,
        t.followers,
        t.total_courses,
        tf.followed_at
    FROM teacher_followers tf
    JOIN teachers t ON tf.teacher_id = t.id
    WHERE tf.follower_user_id = ?
    ORDER BY tf.followed_at DESC
";

$stmt = $conn->prepare($query);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

$following = [];
while ($row = $result->fetch_assoc()) {
    $following[] = [
        'teacher_id' => (int)$row['id'],
        'name' => $row['teacher_name'],
        'bio' => $row['bio'],
        'category' => $row['primary_category'],
        'profile_picture' => $row['profile_picture'],
        'followers' => (int)$row['followers'],
        'total_courses' => (int)$row['total_courses'],
        'followed_at' => $row['followed_at']
    ];
}
$stmt->close();

echo json_encode([
    "status" => "success",
    "following" => $following,
    "total" => count($following)
]);

$conn->close();
exit;