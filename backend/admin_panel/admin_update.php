<?php
include("../header.php");

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['update_admin'])) {

    $email = strtolower(trim(filter_input(INPUT_POST, "email", FILTER_SANITIZE_EMAIL)));
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(["status" => "error", "message" => "Invalid email format."]);
        exit;
    }

    // Fetch existing admin
    $stmt = $conn->prepare("SELECT * FROM users WHERE email=? AND role='admin' LIMIT 1");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();
    $admin = $result->fetch_assoc();
    $stmt->close();

    if (!$admin) {
        echo json_encode(["status" => "error", "message" => "Admin not found."]);
        exit;
    }

    $username = trim($_POST['username'] ?? $admin['username']);
    $currentPassword = $_POST['current_password'] ?? '';
    $newPassword = $_POST['new_password'] ?? '';
    $profilePic = $admin['profile_pic'];

    // Handle password change
    $hashedPassword = $admin['password'];
    if (!empty($newPassword)) {
        if (empty($currentPassword)) {
            echo json_encode(['status' => 'error', 'message' => 'Current password is required to change password']);
            exit;
        }
        if (!password_verify($currentPassword, $admin['password'])) {
            echo json_encode(['status' => 'error', 'message' => 'Current password is incorrect']);
            exit;
        }
        $hashedPassword = password_hash($newPassword, PASSWORD_ARGON2I);
    }

    // Handle profile picture upload
    if (isset($_FILES['profile_pic']) && $_FILES['profile_pic']['error'] === 0) {
        $file = $_FILES['profile_pic'];
        $uploadDir = __DIR__ . '/../uploads/';
        if (!is_dir($uploadDir)) mkdir($uploadDir, 0755, true);

        $info = pathinfo($file['name']);
        $fileExt = strtolower($info['extension']);
        $allowedExts = ['jpg', 'jpeg', 'png', 'gif'];

        if (!in_array($fileExt, $allowedExts)) {
            echo json_encode(['status' => 'error', 'message' => 'Invalid file type.']);
            exit;
        }

        if (!empty($admin['profile_pic']) && file_exists($uploadDir . $admin['profile_pic'])) {
            if ($admin['profile_pic'] !== 'default-image.jpg') {
                unlink($uploadDir . $admin['profile_pic']);
            }
        }

        $safeName = preg_replace('/[^a-z0-9]/', '', explode('@', $email)[0]);
        $newFileName = 'admin_' . $safeName . '_' . bin2hex(random_bytes(8)) . '.' . $fileExt;
        $destination = $uploadDir . $newFileName;
        if (move_uploaded_file($file['tmp_name'], $destination)) {
            $profilePic =  $newFileName;
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Failed to upload profile picture']);
            exit;
        }
    }

    // Dynamic updates using prepared statements
    $updates = [];
    $params = [];
    $types = '';

    if ($username !== $admin['username']) {
        $updates[] = "username=?";
        $params[] = $username;
        $types .= 's';
    }
    if ($hashedPassword !== $admin['password']) {
        $updates[] = "password=?";
        $params[] = $hashedPassword;
        $types .= 's';
    }
    if ($profilePic !== $admin['profile_pic']) {
        $updates[] = "profile_pic=?";
        $params[] = $profilePic;
        $types .= 's';
    }

    if (count($updates) > 0) {
        $query = "UPDATE users SET " . implode(", ", $updates) . " WHERE email=?";
        $params[] = $email;
        $types .= 's';

        $stmt = $conn->prepare($query);
        $stmt->bind_param($types, ...$params);
        if ($stmt->execute()) {
            echo json_encode([
                'status' => 'success',
                'message' => 'Admin profile updated successfully',
                'data' => [
                    'username' => $username,
                    'email' => $email,
                    'profile_pic' => $profilePic
                ]
            ]);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Update failed: ' . $stmt->error]);
        }
        $stmt->close();
    } else {
        echo json_encode(['status' => 'success', 'message' => 'No changes detected']);
    }
}

$conn->close();
exit;
