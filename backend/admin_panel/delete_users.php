<?php
include("../header.php");

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["success" => false, "message" => "Invalid request"]);
    exit;
}

$email = strtolower(trim(filter_input(INPUT_POST, "email", FILTER_SANITIZE_EMAIL)));

if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(["success" => false, "message" => "Invalid email address"]);
    exit;
}

// Fetch the user
$stmt = $conn->prepare("SELECT profile_pic FROM users WHERE email = ? AND role = 'user'");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();
$stmt->close();

if (!$user) {
    echo json_encode(["success" => false, "message" => "User not found or cannot be deleted"]);
    exit;
}

// Delete user
$delete = $conn->prepare("DELETE FROM users WHERE email = ?");
$delete->bind_param("s", $email);

if ($delete->execute()) {
    // Delete their profile picture if exists
    $imagePath = __DIR__ . '/../uploads/' . $user['profile_pic'];
    if (!empty($user['profile_pic']) && file_exists($imagePath)) {
        if ($user['profile_pic'] !== 'default-image.jpg') {
            unlink($imagePath);
        }
    }

    echo json_encode(["success" => true, "message" => "User deleted successfully"]);
} else {
    echo json_encode(["success" => false, "message" => "Failed to delete user"]);
}

$delete->close();
$conn->close();
exit;
