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
            unlink(__DIR__ . '/uploads/' . $picture);
        }
  session_unset();
  session_destroy();
  date_default_timezone_set('Asia/Kathmandu');
  $deleted_at = date('F j, Y, g:i A');
  // F → Full month name (October)
  //j → Day of the month (11)
  //Y → 4-digit year (2025)
  //g → Hour (1–12)
  //i → Minutes (25)
  //A → AM/PM
  $subject = 'Your CultureConnect Account is Deleted';
  $custom_template = "
<html>
<head>
  <meta charset='utf-8' />
  <meta name='viewport' content='width=device-width, initial-scale=1' />
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; font-size: 15px; max-width: 700px; margin: auto; padding: 20px; color: #333; }
    .container { background: #ffffff; padding: 28px; border-radius: 12px; box-shadow: 0 6px 24px rgba(0,0,0,0.08); }
    .headline { font-size: 26px; margin-bottom: 8px; font-weight: 700; color: #e53e3e; }
    .sub { color: #6b7280; margin-bottom: 18px; font-size: 15px; }
    .notice-box {
      display: block;
      background-color: #fff3f2;
      border: 1px solid #ffe4e2;
      padding: 18px 22px;
      font-size: 20px;
      font-weight: 700;
      letter-spacing: 0.6px;
      border-radius: 10px;
      color: #b91c1c;
      text-align: center;
      margin: 18px 0;
      user-select: none;
    }
    .muted { font-size: 13px; color: #6b7280; margin-top: 12px; }
    .footer { margin-top: 20px; font-size: 14px; color: #374151; }
    .support { color: #2563eb; text-decoration: none; }
    .warning-emoji { font-size: 28px; margin-right: 8px; vertical-align: middle; }
    @media (max-width: 520px){
      .container { padding: 18px; }
      .notice-box { font-size: 18px; padding: 14px; }
    }
  </style>
</head>
<body>
  <div class='container'>
    <h1 class='headline'>Account Deleted — Irreversible</h1>

    <p class='sub'>
      We're writing to confirm that your CultureConnect account has been <strong>permanently deleted</strong>.
      All of your profile data, posts, and other associated information have been removed and cannot be recovered.
    </p>

    <div class='notice-box'>
      <span class='warning-emoji'>⚠️</span>
      THIS ACCOUNT HAS BEEN PERMANENTLY DELETED
    </div>

    <p class='muted'>
      If this was done in error or you think someone else deleted your account without permission,
      please contact our support team <strong>immediately</strong>. We may be able to help if the deletion is very recent,
      but in most cases deletions are final.
    </p>

    <p class='footer'>
      Thank you for being part of <strong>CultureConnect</strong>.<br/>
      — The <span style='color:#e11d48;'>CultureConnect</span> Team
    </p>

    <p style='margin-top:18px; font-size:13px; color:#9ca3af;'>
      <em>Deleted on: {$deleted_at}</em>
    </p>

  </div>
</body>
</html>
";

  $response = json_encode(["success" => true]);
  header("Connection: close");
  header("Content-Type: application/json");
  header("Content-Length: " . strlen($response));
  echo $response;
  ob_flush();
  flush();
  ignore_user_abort(true);
  sendemail_verify($email, $subject, $custom_template);
} else {
  echo json_encode(["success" => false, "message" => "Failed to delete account"]);
}

$conn->close();
exit;
