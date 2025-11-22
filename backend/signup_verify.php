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

    $response = json_encode(["status" => "success", "message" => "Verification code resent to $email"]);
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

  $code = trim($_POST['code'] ?? '');

  $stmt = $conn->prepare("SELECT * FROM pending_users WHERE email = ? LIMIT 1");
  $stmt->bind_param("s", $email);
  $stmt->execute();
  $result = $stmt->get_result();
  $row = $result->fetch_assoc();
  $stmt->close();

  if ($row && $row['verify_token'] == $code) {
    $hash = $row['password'];

    $stmt = $conn->prepare("INSERT INTO users (email, username, password) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $email, $username, $hash);
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

      $_SESSION['user_email'] = $email;
      $_SESSION['logged_in'] = true;
      unset($_SESSION['pending_email']);
      unset($_SESSION['pending_verification']);

      $subject = 'Your CultureConnect Account is Ready';
      $custom_template = "
    <html>
    <head>
        <style>
            body {
                font-family: Arial, sans-serif;
                background: #f2f5f7;
                margin: 0;
                padding: 0;
            }
            .container {
                max-width: 600px;
                margin: 40px auto;
                padding: 20px;
            }
            .card {
                background: #ffffff;
                border-radius: 14px;
                box-shadow: 0 8px 20px rgba(0,0,0,0.1);
                padding: 40px 30px;
                text-align: center;
            }
            .title {
                font-size: 30px;
                font-weight: bold;
                color: #4a90e2;
                margin-bottom: 20px;
            }
            .message {
                font-size: 16px;
                color: #555555;
                margin-bottom: 30px;
                line-height: 1.6;
            }
            .highlight-box {
                display: inline-block;
                background: linear-gradient(90deg, #ffb347, #ffcc33);
                color: #ffffff;
                padding: 18px 40px;
                font-size: 20px;
                font-weight: bold;
                border-radius: 10px;
                letter-spacing: 1px;
                box-shadow: 0 5px 12px rgba(0,0,0,0.2);
            }
            .footer {
                margin-top: 35px;
                font-size: 14px;
                color: #777777;
                line-height: 1.5;
            }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='card'>
                <div class='title'>Thank You for Joining CultureConnect!</div>
                <div class='message'>
                    We're thrilled to have you on board. Your account has been successfully created, and you now have full access to explore, connect, and enjoy everything <strong>CultureConnect</strong> offers.
                </div>
                <div class='highlight-box'>Account Created Successfully 🎉</div>
                <div class='footer'>
                    If you did not create this account, please contact our support immediately.<br>
                    We’re excited to have you with us!<br>- The <span style='color:red;'>CultureConnect</span> Team
                </div>
            </div>
        </div>
    </body>
</html>

        ";

      $response = json_encode([
        "status" => "success",
        "user" => [
          "email" => $email,
          "name" => $new_user['username'] ?? '',
          "gender" => $new_user['gender'] ?? '',
          "location" => [
            "province" => $new_user['province'] ?? '',
            "district" => $new_user['district'] ?? '',
            "municipality" => $new_user['municipality'] ?? '',
            "ward" => $new_user['ward'] ?? ''
          ],
          "avatar" => $new_user['profile_pic'] ?? ''
        ]
      ]);

      header("Connection: close");
      header("Content-Type: application/json");
      header("Content-Length: " . strlen($response));
      echo $response;
      ob_flush();
      flush();

      ignore_user_abort(true);
      sendemail_verify($email, $subject, $custom_template);
      
    } else {
      echo json_encode(["status" => "error", "message" => "Failed to activate account. Please try again later."]);
    }
  } else {
    echo json_encode(["status" => "error", "message" => "Incorrect OTP. Please enter the correct one!"]);
  }
}

$conn->close();
exit;
