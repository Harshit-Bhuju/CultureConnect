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

    $action = $_POST['action'] ?? '';
    $currentPassword = trim($_POST['currentPassword'] ?? '');

    $newPassword = trim($_POST['newPassword'] ?? '');
    $hash_newPass = password_hash($newPassword, PASSWORD_ARGON2I);
    $otp = trim($_POST['otp'] ?? '');

    //verify current pass
    if ($action === "verify_current") {
        $stmt = $conn->prepare("SELECT password FROM users WHERE email = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();
        $row = $result->fetch_assoc();

        if (password_verify($currentPassword, $row['password'])) {
            echo json_encode(["status" => "success", "message" => "Current password verified"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Current password is incorrect"]);
        }
    }

    //  OTP send 
    if ($action === "send_otp" || $action === "resend_otp") {
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

        $response = json_encode(["status" => "otp_sent", "message" => "Verification code resent to $email"]);
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

    // Verify OTP 
    if ($action === "verify_otp") {
        $stmt = $conn->prepare("SELECT * FROM forgot WHERE email = ? LIMIT 1");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();
        $row = $result->fetch_assoc();
        $stmt->close();

        if ($row && $row['forgot_code'] == $otp) {

            $stmt = $conn->prepare("DELETE FROM forgot WHERE email = ?");
            $stmt->bind_param("s", $email);
            $stmt->execute();
            $stmt->close();

            echo json_encode(["status" => "success", "message" => "OTP matched!"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Incorrect OTP. Please enter the correct one!"]);
        }
    }

    // Change Password 
    if ($action === "change_password") {
        $stmt = $conn->prepare("SELECT * FROM users WHERE email = ? LIMIT 1");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();
        $row = $result->fetch_assoc();
        $stmt->close();

        if (password_verify($newPassword, $row['password'])) {
            echo json_encode(["status" => "error", "message" => "Your new password cannot be the same as your current (old) password. Please choose a different password."]);
            exit;
        }

        $stmt = $conn->prepare("UPDATE users SET password = ? WHERE email = ?");
        $stmt->bind_param("ss", $hash_newPass, $email);
        $stmt->execute();
        $stmt->close();
        echo json_encode(["status" => "password_changed", "message" => "Password changed successfully"]);
    }
}
$conn->close();
exit;
