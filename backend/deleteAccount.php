<?php
session_start();
include("mail.php");
include("header.php");


$email = $_SESSION['user_email'] ?? '';
$password = trim($_POST['password'] ?? "");

// Example: verify password and delete user
$stmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();

$picture = $user['profile_pic'];
// Verify password
if (!password_verify($password, $user['password'])) {
  echo json_encode(["success" => false, "message" => "Incorrect password"]);
  exit;
}

// Delete account
$delete = $conn->prepare("DELETE FROM users WHERE email = ?");
$delete->bind_param("s", $email);

if ($delete->execute()) {
  if (file_exists(__DIR__ . '/uploads/' . $picture)) {
    if ( $picture !== 'default-image.jpg') {
    unlink(__DIR__ . '/uploads/' . $picture);
    }
  }
  session_unset();
  session_destroy();

$response = ["success" => true];
sendResponseAndContinue($response);
 sendAccountDeletedEmail($email);
} else {
  echo json_encode(["success" => false, "message" => "Failed to delete account"]);
}

$conn->close();
exit;
