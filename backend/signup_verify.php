<?php
session_start();
include("dbconnect.php");
include("mail.php");
include("username_gen.php");

// Headers
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

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
    $subject = 'Your CultureConnect Account is Almost Ready';
    $custom_template = "
  <html>
  <head>
    <style>
      .code-box {
        display: inline-block;
        background-color: #f0f0f0;
        padding: 15px 25px;
        font-size: 24px;
        font-weight: bold;
        letter-spacing: 6px;
        border-radius: 8px;
        user-select: all;
        margin-top: 20px;
      }
    </style>
  </head>
  <body style='font-family: Arial, sans-serif; line-height: 1.6; font-size: 15px; max-width: 600px; margin: auto; padding: 20px;'>
    <h1 style='font-size: 26px; margin-bottom: 15px; font-weight: bold; color: #4a90e2;'>Verify Your New CultureConnect Account</h1>
    <p>To complete your registration, please use the following verification code to confirm your email address:</p>
    <div class='code-box'>{$verify_token}</div>
    <p style='margin-top: 20px; font-size: 14px; color: #555;'>
      If you did not create this account, no further action is needed. Your information will remain secure with us.
    </p>
    <p>Thanks for signing up for <strong>CultureConnect</strong>!<br>- The <span style='color:red;'>CultureConnect</span> Team</p>
  </body>
  </html>
    ";

    $stmt = $conn->prepare("UPDATE pending_users SET verify_token = ? WHERE email = ?");
    $stmt->bind_param("is", $verify_token, $email);
    $stmt->execute();
    $stmt->close();

    $response = json_encode(["status" => "success", "message" => "Verification code resent to $email"]);
    header("Connection: close");
    header("Content-Type: application/json");
    header("Content-Length: " . strlen($response));
    echo $response;
    ob_flush();
    flush();

    ignore_user_abort(true);

    sendemail_verify($email, $subject, $custom_template);

    exit(); //either exit(); or just exit; both are same
  }

  // Verify OTP
  $code = trim($_POST['code'] ?? '');

  $stmt = $conn->prepare("SELECT * FROM pending_users WHERE email = ? LIMIT 1");
  $stmt->bind_param("s", $email);
  $stmt->execute();

  $result = $stmt->get_result();
  $row = $result->fetch_assoc();
  $stmt->close();

  if ($row && $row['verify_token'] == $code) {
    $hash = $row['password'];

    //  Insert into users table
    $stmt = $conn->prepare("INSERT INTO users (email,username, password) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $email, $username, $hash);
    $inserted = $stmt->execute();
    $stmt->close();

    if ($inserted) {
      // Remove from pending table
      $stmt = $conn->prepare("DELETE FROM pending_users WHERE email = ?");
      $stmt->bind_param("s", $email);
      $stmt->execute();
      $stmt->close();


      $_SESSION['user_email'] = $email;
      $_SESSION['logged_in'] = true;
      unset($_SESSION['pending_email']);
      unset($_SESSION['pending_verification']);
      $_SESSION['last_activity'] = time();

      $stmt = $conn->prepare("SELECT * FROM users WHERE email = ? LIMIT 1");
      $stmt->bind_param("s", $email);
      $stmt->execute();
      $result = $stmt->get_result();
      $row = $result->fetch_assoc();
      $stmt->close();

      echo json_encode([
        "status" => "success",
        "user" => [
          "email" => $email,
          "name" => $row['username'] ?? '',
          "gender" => $row['gender'] ?? '',
          "location" => $row['location'] ?? '',
          "picture" => $row['profile_pic'] ?? ''
        ]
      ]);
    } else {
      echo json_encode(["status" => "error", "message" => "Failed to activate account. Please try again later."]);
    }
  } else {
    echo json_encode(["status" => "error", "message" => "Incorrect code. Please enter the correct one!"]);
  }
}
$conn->close();
exit;
