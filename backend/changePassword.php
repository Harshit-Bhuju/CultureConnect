<?php
session_start();
include("header.php");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

  $email = $_SESSION['forgot_email'] ?? '';

  if (empty($email)) {
    echo json_encode(["status" => "error", "message" => "Session expired. Please request password reset again."]);
    exit;
  }

  $password = trim($_POST['password']);
  $hash = password_hash($password, PASSWORD_ARGON2ID);

  $stmt = $conn->prepare("SELECT * FROM users WHERE email = ? LIMIT 1");
  $stmt->bind_param("s", $email);
  $stmt->execute();
  $result = $stmt->get_result();
  $row = $result->fetch_assoc();
  $stmt->close();

  if (password_verify($password, $row['password'])) {
    echo json_encode(["status" => "same", "message" => "Your new password cannot be the same as your current (old) password. Please choose a different password."]);
    exit;
  }

  $stmt = $conn->prepare("UPDATE users SET password = ? WHERE email = ?");
  $stmt->bind_param("ss", $hash, $email);
  $stmt->execute();
  $stmt->close();

  unset($_SESSION['forgot_email']);
  echo json_encode(["status" => "success"]);
}

$conn->close();
exit;
