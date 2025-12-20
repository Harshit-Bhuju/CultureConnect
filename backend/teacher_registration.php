<?php
session_start();
include("header.php");
include("mail.php");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    if (!isset($_SESSION['user_email'])) {
        echo json_encode(["status" => "error", "message" => "User not logged in"]);
        exit;
    }

    $user_email = $_SESSION['user_email'];

    // Fetch user
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

    // Get form data
    $teacher_name = ucwords(strtolower(trim($_POST['name'] ?? '')));
    $bio = trim($_POST['bio'] ?? '');
    $phone = trim($_POST['phone'] ?? '');
    $primary_category = trim($_POST['category'] ?? '');

    // Validate inputs
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

    // Check if teacher account already exists
    $check_stmt = $conn->prepare("SELECT id FROM teachers WHERE user_id = ? LIMIT 1");
    $check_stmt->bind_param("i", $user_id);
    $check_stmt->execute();
    $check_stmt->store_result();
    if ($check_stmt->num_rows > 0) {
        $check_stmt->close();
        echo json_encode(["status" => "error", "message" => "You already have a teacher account"]);
        exit;
    }
    $check_stmt->close();

    // Upload profile picture
    $profile_picture = null;
    if (isset($_FILES['profilePicture']) && $_FILES['profilePicture']['error'] === 0) {
        $file = $_FILES['profilePicture'];
        $uploadDir = __DIR__ . '/teacher_datas/profile_pictures/';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }

        $fileExt = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));

        // Validate if the file is an image
        if (!getimagesize($_FILES['profilePicture']['tmp_name'])) {
            echo json_encode(["status" => "error", "message" => "Not a valid image"]);
            exit;
        }

        $allowedExts = ['jpg', 'jpeg', 'png', 'gif'];
        if (!in_array($fileExt, $allowedExts)) {
            echo json_encode(['status' => 'error', 'message' => 'Invalid profile picture file type']);
            exit;
        }

        if ($file['size'] > 5 * 1024 * 1024) {
            echo json_encode(['status' => 'error', 'message' => 'Profile picture file too large (max 5MB)']);
            exit;
        }

        $emailSafe = preg_replace('/[^a-z]/', '', explode('@', $user_email)[0]);
        $profile_picture = 'profile_' . $emailSafe . '_' . bin2hex(random_bytes(8)) . '.' . $fileExt;

        if (!move_uploaded_file($file['tmp_name'], $uploadDir . $profile_picture)) {
            echo json_encode(['status' => 'error', 'message' => 'Profile picture upload failed']);
            exit;
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Profile picture is required']);
        exit;
    }

    // Upload certificates
    $certificates = [];
    if (isset($_FILES['certificates']) && is_array($_FILES['certificates']['name'])) {
        $uploadDir = __DIR__ . '/teacher_datas/certificates/';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }

        $fileCount = count($_FILES['certificates']['name']);

        if ($fileCount < 1) {
            echo json_encode(['status' => 'error', 'message' => 'At least one certificate is required']);
            exit;
        }

        if ($fileCount > 5) {
            echo json_encode(['status' => 'error', 'message' => 'Maximum 5 certificates allowed']);
            exit;
        }
        
        for ($i = 0; $i < $fileCount; $i++) {
            if ($_FILES['certificates']['error'][$i] === 0) {
                $file = [
                    'name' => $_FILES['certificates']['name'][$i],
                    'tmp_name' => $_FILES['certificates']['tmp_name'][$i],
                    'size' => $_FILES['certificates']['size'][$i],
                    'type' => $_FILES['certificates']['type'][$i]
                ];

                $fileExt = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));

                // Only accept image files
                $allowedExts = ['jpg', 'jpeg', 'png', 'gif'];
                if (!in_array($fileExt, $allowedExts)) {
                    echo json_encode(['status' => 'error', 'message' => 'Invalid certificate file type. Only JPG, PNG, and GIF are allowed']);
                    exit;
                }

                // Validate that it's actually an image
                if (!getimagesize($file['tmp_name'])) {
                    echo json_encode(["status" => "error", "message" => "Certificate file is not a valid image"]);
                    exit;
                }

                if ($file['size'] > 5 * 1024 * 1024) {
                    echo json_encode(['status' => 'error', 'message' => 'Certificate file too large (max 5MB)']);
                    exit;
                }

                $emailSafe = preg_replace('/[^a-z]/', '', explode('@', $user_email)[0]);
                $certFilename = 'cert_' . $emailSafe . '_' . ($i + 1) . '_' . bin2hex(random_bytes(8)) . '.' . $fileExt;

                if (!move_uploaded_file($file['tmp_name'], $uploadDir . $certFilename)) {
                    echo json_encode(['status' => 'error', 'message' => 'Certificate upload failed']);
                    exit;
                }

                $certificates[] = $certFilename;
            }
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'At least one certificate is required']);
        exit;
    }

    // Insert teacher record with status='pending'
    $insert_stmt = $conn->prepare("INSERT INTO teachers (user_id, teacher_name, bio, esewa_phone, primary_category, profile_picture, status) VALUES (?, ?, ?, ?, ?, ?, 'pending')");
    $insert_stmt->bind_param("isssss", $user_id, $teacher_name, $bio, $phone, $primary_category, $profile_picture);

    if ($insert_stmt->execute()) {
        $teacher_id = $insert_stmt->insert_id;
        $insert_stmt->close();

        // Insert certificates
        $cert_stmt = $conn->prepare("INSERT INTO teacher_certificates (teacher_id, certificate_filename) VALUES (?, ?)");
        foreach ($certificates as $cert) {
            $cert_stmt->bind_param("is", $teacher_id, $cert);
            $cert_stmt->execute();
        }
        $cert_stmt->close();

        // Update user role
        $current_role_stmt = $conn->prepare("SELECT role FROM users WHERE email = ? LIMIT 1");
        $current_role_stmt->bind_param("s", $user_email);
        $current_role_stmt->execute();
        $current_role_result = $current_role_stmt->get_result();
        $current_role = $current_role_result->fetch_assoc()['role'];
        $current_role_stmt->close();

        $new_role = ($current_role === 'seller') ? 'seller_teacher' : 'teacher';

        $update_role_stmt = $conn->prepare("UPDATE users SET role = ? WHERE email = ?");
        $update_role_stmt->bind_param("ss", $new_role, $user_email);
        $update_role_stmt->execute();
        $update_role_stmt->close();

        $response = ["status" => "success", "teacher_id" => $teacher_id];
        sendResponseAndContinue($response);
        sendTeacherPendingVerificationEmail($user_email, $teacher_name);
        exit;
    } else {
        echo json_encode(["status" => "error", "message" => "Failed to create teacher account. Please try again later."]);
        exit;
    }
}

$conn->close();
exit;