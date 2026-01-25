<?php
require_once __DIR__ . '/../config/session_config.php';
include("../config/header.php");

// Only allow admins to create delivery boy accounts
if (!isset($_SESSION['logged_in']) || $_SESSION['logged_in'] !== true) {
    echo json_encode(["status" => "error", "message" => "Unauthorized access."]);
    exit;
}

// Check admin role
$admin_email = $_SESSION['user_email'];
$admin_check = $conn->prepare("SELECT role FROM users WHERE email = ? LIMIT 1");
$admin_check->bind_param("s", $admin_email);
$admin_check->execute();
$admin_result = $admin_check->get_result();
$admin = $admin_result->fetch_assoc();

if (!$admin || $admin['role'] !== 'admin') {
    echo json_encode(["status" => "error", "message" => "Admin access required."]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = strtolower(trim(filter_input(INPUT_POST, "email", FILTER_SANITIZE_EMAIL)));
    $password = trim($_POST['password']);

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(["status" => "error", "message" => "Invalid email format."]);
        exit;
    }

    if (strlen($password) < 8) {
        echo json_encode(["status" => "error", "message" => "Password must be at least 8 characters."]);
        exit;
    }

    // Check if user already exists
    $stmt = $conn->prepare("SELECT id FROM users WHERE email = ? LIMIT 1");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        echo json_encode(["status" => "error", "message" => "Email already exists."]);
        exit;
    }
    $stmt->close();

    // Create delivery boy
    require_once __DIR__ . '/../username_gen.php';
    $hash = password_hash($password, PASSWORD_ARGON2ID);
    $role = 'delivery';
    $username = generateSignupUsername($email, $conn);
    $default_profile_pic = 'default-image.jpg';

    $insert_stmt = $conn->prepare("INSERT INTO users (email, password, role, username, profile_pic) VALUES (?, ?, ?, ?, ?)");
    $insert_stmt->bind_param("sssss", $email, $hash, $role, $username, $default_profile_pic);

    if ($insert_stmt->execute()) {
        echo json_encode(["status" => "success", "message" => "Delivery boy account created successfully."]);
    } else {
        echo json_encode(["status" => "error", "message" => "Failed to create account."]);
    }
    $insert_stmt->close();
    $conn->close();
    exit;
}

echo json_encode(["status" => "error", "message" => "Invalid request method."]);
exit;
