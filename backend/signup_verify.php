<?php
session_start();
include("mail.php");
include("username_gen.php");
include("header.php");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

  $action = $_POST['action'] ?? '';
  $email = $_SESSION['pending_email'] ?? '';

  if (empty($email)) {
    echo json_encode(["status" => "error", "message" => "Session expired. Please sign up again."]);
    exit;
  }
  $username = generateSignupUsername($email, $conn);

  if ($action === 'resend') {
    $verify_token = random_int(100000, 999999);

    $stmt = $conn->prepare("UPDATE pending_users SET verify_token = ? WHERE email = ?");
    $stmt->bind_param("is", $verify_token, $email);
    $stmt->execute();
    $stmt->close();

    $response = ["status" => "success", "message" => "Verification code resent to $email"];
    sendResponseAndContinue($response);
    sendOTPEmail($email, $verify_token);
    exit();
  }

  $code = trim($_POST['code'] ?? '');

  $stmt = $conn->prepare("SELECT * FROM pending_users WHERE email = ? LIMIT 1");
  $stmt->bind_param("s", $email);
  $stmt->execute();
  $result = $stmt->get_result();
  $row = $result->fetch_assoc();
  $stmt->close();

  if ($row && $row['verify_token'] == $code) {
    $hash = $row['password'];
    $picture = "default-image.jpg";
    $stmt = $conn->prepare("INSERT INTO users (email, username, password, profile_pic) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("ssss", $email, $username, $hash, $picture);
    $inserted = $stmt->execute();
    $stmt->close();

    if ($inserted) {
      $stmt = $conn->prepare("DELETE FROM pending_users WHERE email = ?");
      $stmt->bind_param("s", $email);
      $stmt->execute();
      $stmt->close();

      $stmt = $conn->prepare("SELECT * FROM users WHERE email = ? LIMIT 1");
      $stmt->bind_param("s", $email);
      $stmt->execute();
      $result = $stmt->get_result();
      $new_user = $result->fetch_assoc();
      $stmt->close();
      session_regenerate_id(true);
      $_SESSION['user_email'] = $email;
      $_SESSION['logged_in'] = true;
      unset($_SESSION['pending_email']);
      unset($_SESSION['pending_verification']);


      $response = [
        "status" => "success",
        "message" => "Account Created Successfully!",
        "user" => [
          "email" => $email,
          "name" => $new_user['username'] ?? '',
          "gender" => $new_user['gender'] ?? '',
          "location" => [
            "province" => $new_user['province'] ?? '',
            "district" => $new_user['district'] ?? '',
            "municipality" => $new_user['municipality'] ?? '',
            "ward" => $new_user['ward'] ?? '',
          ],
          "avatar" => $new_user['profile_pic'] ?? '',
          "seller_id" =>  null,
          "teacher_id" => null
        ]
      ];
      sendResponseAndContinue($response);
      sendAccountCreatedEmail($email);
    } else {
      echo json_encode(["status" => "error", "message" => "Failed to activate account. Please try again later."]);
    }
  } else {
    echo json_encode(["status" => "error", "message" => "Incorrect OTP. Please enter the correct one!"]);
  }
}

$conn->close();
exit;
