<?php
session_start();
include("header.php");

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["status" => "error", "message" => "Invalid request method"]);
    exit;
}

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

// Get POST data
$teacher_id = isset($_POST['teacher_id']) ? intval($_POST['teacher_id']) : 0;
$action = isset($_POST['action']) ? trim($_POST['action']) : '';

if (!$teacher_id || !in_array($action, ['follow', 'unfollow'])) {
    echo json_encode(["status" => "error", "message" => "Invalid parameters"]);
    exit;
}

// Check if teacher exists
$check_teacher = $conn->prepare("SELECT id FROM teachers WHERE id = ? LIMIT 1");
$check_teacher->bind_param("i", $teacher_id);
$check_teacher->execute();
$teacher_result = $check_teacher->get_result();

if ($teacher_result->num_rows === 0) {
    $check_teacher->close();
    echo json_encode(["status" => "error", "message" => "Teacher not found"]);
    exit;
}
$check_teacher->close();

// Check if user is trying to follow their own teacher profile
$own_teacher_check = $conn->prepare("SELECT id FROM teachers WHERE id = ? AND user_id = ? LIMIT 1");
$own_teacher_check->bind_param("ii", $teacher_id, $user_id);
$own_teacher_check->execute();
$own_result = $own_teacher_check->get_result();

if ($own_result->num_rows > 0) {
    $own_teacher_check->close();
    echo json_encode(["status" => "error", "message" => "You cannot follow your own teacher profile"]);
    exit;
}
$own_teacher_check->close();

try {
    if ($action === 'follow') {
        // Check if already following
        $check_stmt = $conn->prepare("SELECT id FROM teacher_followers WHERE teacher_id = ? AND follower_user_id = ? LIMIT 1");
        $check_stmt->bind_param("ii", $teacher_id, $user_id);
        $check_stmt->execute();
        $check_result = $check_stmt->get_result();

        if ($check_result->num_rows > 0) {
            $check_stmt->close();
            echo json_encode(["status" => "error", "message" => "Already following this teacher"]);
            exit;
        }
        $check_stmt->close();

        // Add follow
        $insert_stmt = $conn->prepare("INSERT INTO teacher_followers (teacher_id, follower_user_id) VALUES (?, ?)");
        $insert_stmt->bind_param("ii", $teacher_id, $user_id);

        if ($insert_stmt->execute()) {
            $insert_stmt->close();

            // Get updated followers count
            $count_stmt = $conn->prepare("SELECT followers FROM teachers WHERE id = ? LIMIT 1");
            $count_stmt->bind_param("i", $teacher_id);
            $count_stmt->execute();
            $count_result = $count_stmt->get_result();
            $count_row = $count_result->fetch_assoc();
            $followers_count = $count_row['followers'];
            $count_stmt->close();

            echo json_encode([
                "status" => "success",
                "message" => "Successfully followed teacher",
                "is_following" => true,
                "followers_count" => (int)$followers_count
            ]);
        } else {
            $insert_stmt->close();
            echo json_encode(["status" => "error", "message" => "Failed to follow teacher"]);
        }
    } else if ($action === 'unfollow') {
        // Remove follow
        $delete_stmt = $conn->prepare("DELETE FROM teacher_followers WHERE teacher_id = ? AND follower_user_id = ? LIMIT 1");
        $delete_stmt->bind_param("ii", $teacher_id, $user_id);

        if ($delete_stmt->execute()) {
            $affected_rows = $delete_stmt->affected_rows;
            $delete_stmt->close();

            if ($affected_rows > 0) {
                // Get updated followers count
                $count_stmt = $conn->prepare("SELECT followers FROM teachers WHERE id = ? LIMIT 1");
                $count_stmt->bind_param("i", $teacher_id);
                $count_stmt->execute();
                $count_result = $count_stmt->get_result();
                $count_row = $count_result->fetch_assoc();
                $followers_count = $count_row['followers'];
                $count_stmt->close();

                echo json_encode([
                    "status" => "success",
                    "message" => "Successfully unfollowed teacher",
                    "is_following" => false,
                    "followers_count" => (int)$followers_count
                ]);
            } else {
                echo json_encode(["status" => "error", "message" => "You are not following this teacher"]);
            }
        } else {
            $delete_stmt->close();
            echo json_encode(["status" => "error", "message" => "Failed to unfollow teacher"]);
        }
    }
} catch (Exception $e) {
    echo json_encode([
        "status" => "error",
        "message" => "An error occurred: " . $e->getMessage()
    ]);
}

$conn->close();
exit;
