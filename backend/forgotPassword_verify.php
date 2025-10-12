<?php
session_start();
include("dbconnect.php");
include("mail.php");

// Headers
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");


if ($_SERVER['REQUEST_METHOD'] === 'POST') {

  $action = $_POST['action'] ?? '';

  $email = $_SESSION['forgot_email'] ?? '';

  if (empty($email)) {
    echo json_encode(["status" => "error", "message" => "Session expired. Please request password reset again."]);
    exit;
  }

  if ($action === 'resend') {
    $verify_token = random_int(100000, 999999);
    $subject = 'Reset Your Password';
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
    <h1 style='font-size: 26px; margin-bottom: 15px; font-weight: bold; color: #4a90e2;'>Reset Your Password</h1>
    <p>We received a request to reset the password for your CultureConnect account .</p>
    <p>Please use the following verification code to reset your password:</p>
    <div class='code-box'>{$verify_token}</div>
    <p style='margin-top: 20px; font-size: 14px; color: #555;'>
      If you did not request a password reset, please ignore this email. Your account is safe.
    </p>
    <p>Thanks,<br>The <span style='color:red;'>CultureConnect</span> Team</p>
  </body>
  </html>
      ";

    $stmt = $conn->prepare("UPDATE forgot SET forgot_code = ? WHERE email = ?");
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
  $stmt = $conn->prepare("SELECT * FROM forgot WHERE email = ? LIMIT 1");
  $stmt->bind_param("s", $email);
  $stmt->execute();

  $result = $stmt->get_result();
  $row = $result->fetch_assoc();
  $stmt->close();

  if ($row && $row['forgot_code'] == $code) {

    $stmt = $conn->prepare("DELETE FROM forgot WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $stmt->close();

    // Keep forgot_email in session for changePassword.php
    echo json_encode(["status" => "success"]);
  } else {
    echo json_encode(["status" => "error", "message" => "Incorrect code. Please enter the correct one!"]);
  }
}
$conn->close();
exit;
