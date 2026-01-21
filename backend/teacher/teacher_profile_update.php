<?php
require_once __DIR__ . '/../config/session_config.php';
include("../config/header.php");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    if (!isset($_SESSION['user_email'])) {
        echo json_encode(["status" => "error", "message" => "User not logged in"]);
        exit;
    }

    $user_email = $_SESSION['user_email'];

    // Fetch user and teacher_id
    $stmt = $conn->prepare("SELECT u.id, t.id as teacher_id, t.profile_picture, t.status FROM users u JOIN teachers t ON u.id = t.user_id WHERE u.email = ? LIMIT 1");
    $stmt->bind_param("s", $user_email);
    $stmt->execute();
    $result = $stmt->get_result();
    $teacher = $result->fetch_assoc();
    $stmt->close();

    if (!$teacher) {
        echo json_encode(["status" => "error", "message" => "Teacher account not found"]);
        exit;
    }

    $teacher_id = $teacher['teacher_id'];
    $current_profile_pic = $teacher['profile_picture'];

    // Get form data
    $teacher_name = ucwords(strtolower(trim($_POST['name'] ?? '')));
    $bio = trim($_POST['bio'] ?? '');
    $phone = trim($_POST['phone'] ?? '');
    $primary_category = trim($_POST['category'] ?? '');

    // Validate inputs (similar to Teacher_Registration.jsx)
    if (empty($teacher_name) || strlen($teacher_name) < 3 || strlen($teacher_name) > 100) {
        echo json_encode(["status" => "error", "message" => "Teacher name must be 3-100 characters"]);
        exit;
    }

    if (empty($bio) || strlen($bio) < 10 || strlen($bio) > 2000) {
        echo json_encode(["status" => "error", "message" => "Bio must be 10-2000 characters"]);
        exit;
    }

    if (!preg_match('/^(98|97)\d{8}$/', $phone)) {
        echo json_encode(["status" => "error", "message" => "Invalid phone number format"]);
        exit;
    }

    if (empty($primary_category)) {
        echo json_encode(["status" => "error", "message" => "Primary category is required"]);
        exit;
    }

    // Handle Profile Picture
    $profile_picture = $current_profile_pic;
    if (isset($_FILES['profilePicture']) && $_FILES['profilePicture']['error'] === 0) {
        $file = $_FILES['profilePicture'];
        $uploadDir = dirname(__DIR__) . '/uploads/teacher_datas/profile_pictures/';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }

        $fileExt = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        $allowedExts = ['jpg', 'jpeg', 'png', 'gif'];

        if (!in_array($fileExt, $allowedExts)) {
            echo json_encode(['status' => 'error', 'message' => 'Invalid profile picture file type']);
            exit;
        }

        if ($file['size'] > 5 * 1024 * 1024) {
            echo json_encode(['status' => 'error', 'message' => 'Profile picture too large (max 5MB)']);
            exit;
        }

        $emailSafe = preg_replace('/[^a-z]/', '', explode('@', $user_email)[0]);
        $new_filename = 'profile_' . $emailSafe . '_' . bin2hex(random_bytes(8)) . '.' . $fileExt;

        if (move_uploaded_file($file['tmp_name'], $uploadDir . $new_filename)) {
            // Delete old profile picture if exists and not default
            if ($current_profile_pic && $current_profile_pic !== 'default-teacher-pic.jpg' && file_exists($uploadDir . $current_profile_pic)) {
                unlink($uploadDir . $current_profile_pic);
            }
            $profile_picture = $new_filename;
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Profile picture upload failed']);
            exit;
        }
    }

    // Update teacher info (Keep status as it is, no admin re-validation)
    $update_stmt = $conn->prepare("UPDATE teachers SET teacher_name = ?, bio = ?, esewa_phone = ?, primary_category = ?, profile_picture = ? WHERE id = ?");
    $update_stmt->bind_param("sssssi", $teacher_name, $bio, $phone, $primary_category, $profile_picture, $teacher_id);

    if ($update_stmt->execute()) {
        echo json_encode(["status" => "success", "message" => "Profile updated successfully"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Failed to update profile"]);
    }
    $update_stmt->close();
} else {
    echo json_encode(["status" => "error", "message" => "Invalid request method"]);
}

$conn->close();
