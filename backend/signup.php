<?php
session_start();
include("dbconnect.php");
include("mail.php");
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");


if ($_SERVER['REQUEST_METHOD'] == 'POST') {

  $email = strtolower(trim(filter_input(INPUT_POST, "email", FILTER_SANITIZE_EMAIL)));
  if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(["status" => "error", "message" => "Invalid email format."]);
    exit;
  }

  $password = trim($_POST['password']);
  $hash = password_hash($password, PASSWORD_ARGON2ID);
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

    $_SESSION['pending_email'] = $email;
    $_SESSION['pending_verification'] = true;
    $_SESSION['last_activity'] = time();

    $response = json_encode(["status" => "success"]);


    header("Connection: close");
    header("Content-Type: application/json");
    header("Content-Length: " . strlen($response));
    echo $response;
    ob_flush();
    flush();
    ignore_user_abort(true);
    sendemail_verify($email, $subject, $custom_template);

    // Summary:
    // After a successful signup, respond instantly to the user and then continue running
    // in the background to send the verification email, even if the user leaves the page.
    exit();
    // we need to exit after every json
  } else {
    echo json_encode([
      "status" => "error",
    ]);
  }
}


$conn->close();
exit;
