<?php
session_start();
include("mail.php");
include("header.php");

if ($_SERVER['REQUEST_METHOD'] == 'POST') {

  $email = strtolower(trim(filter_input(INPUT_POST, "email", FILTER_SANITIZE_EMAIL)));
  if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(["status" => "error", "message" => "Invalid email format."]);
    exit;
  }
  // Check if email exists in users (already verified)
  $stmt = $conn->prepare("SELECT email FROM users WHERE email = ? LIMIT 1");
  $stmt->bind_param("s", $email);
  $stmt->execute();
  $stmt->store_result();

  if ($stmt->num_rows > 0) {
    $stmt->close();
    echo json_encode([
      "status" => "error",
      "field" => "email",
      "message" => "Email already in use"
    ]);
    exit();
  }
  $stmt->close();

  $password = trim($_POST['password']);
  $hash = password_hash($password, PASSWORD_ARGON2ID);
  $verify_token = random_int(100000, 999999);

  // Check if email exists in pending_users
  $stmt = $conn->prepare("SELECT email FROM pending_users WHERE email = ? LIMIT 1");
  $stmt->bind_param("s", $email);
  $stmt->execute();
  $stmt->store_result();

  if ($stmt->num_rows > 0) {
    $stmt->close();
    // Delete old pending record to overwrite
    $del_stmt = $conn->prepare("DELETE FROM pending_users WHERE email = ?");
    $del_stmt->bind_param("s", $email);
    $del_stmt->execute();
    $del_stmt->close();
  } else {
    $stmt->close();
  }

  // Insert new pending user record
  $insert_stmt = $conn->prepare("INSERT INTO pending_users (email, password, verify_token) VALUES (?, ?, ?)");
  $insert_stmt->bind_param("ssi", $email, $hash, $verify_token);
  $insert_success = $insert_stmt->execute();
  $insert_stmt->close();

  if ($insert_success) {
    session_regenerate_id(true);
    $_SESSION['pending_email'] = $email;
    $_SESSION['pending_verification'] = true;
    sendResponseAndContinue(["status" => "success"]);
    sendOTPEmail($email, $verify_token);
    exit();
  } else {
    echo json_encode([
      "status" => "error",
    ]);
  }
}


$conn->close();
exit;
