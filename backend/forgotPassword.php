<?php
session_start();
include("mail.php");
include("header.php");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

  $email = strtolower(trim(filter_input(INPUT_POST, "email", FILTER_SANITIZE_EMAIL)));
  if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(["status" => "error", "message" => "Invalid email format."]);
    exit;
  }

  $stmt = $conn->prepare("SELECT * FROM users where email = ? LIMIT 1");
  $stmt->bind_param("s", $email);
  $stmt->execute();
  $result = $stmt->get_result();
  $stmt->close();

  if ($result->num_rows !== 1) {
    echo json_encode(["status" => "error", "message" => "This email is not verified, Please Sign Up first"]);
    exit;
  } else {
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
    $stmt = $conn->prepare("SELECT * FROM forgot where email = ? LIMIT 1");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();
    $stmt->close();


    //instead of updating we first delete and insert because
    // its easier this way to check if user has already clicked or not so 
    // it is different from forgotpassword_verify
    if ($result->num_rows > 0) {
      $stmt = $conn->prepare("DELETE FROM forgot where email = ?");
      $stmt->bind_param("s", $email);
      $stmt->execute();
      $stmt->close();
    }

    $stmt = $conn->prepare("INSERT INTO forgot(email,forgot_code) VALUES(?,?)");
    $stmt->bind_param("si", $email, $verify_token);
    $stmt->execute();
    $stmt->close();

    $_SESSION['forgot_email'] = $email;

    $response = json_encode(["status" => "success", "message" => "Code sent to $email"]);
    header("Connection: close");
    header("Content-Type: application/json");
    header("Content-Length: " . strlen($response));
    echo $response;
    ob_flush();
    flush();
    ignore_user_abort(true);
    sendemail_verify($email, $subject, $custom_template);
    exit();
  }
}

$conn->close();
exit;
