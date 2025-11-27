<?php
session_start();
include("mail.php");
include("header.php");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

  $action = $_POST['action'] ?? '';

  $email = $_SESSION['forgot_email'] ?? '';

  if (empty($email)) {
    echo json_encode(["status" => "error", "message" => "Session expired. Please request password reset again."]);
    exit;
  }

  if ($action === 'resend') {
    $verify_token = random_int(100000, 999999);

    $stmt = $conn->prepare("UPDATE forgot SET forgot_code = ? WHERE email = ?");
    $stmt->bind_param("is", $verify_token, $email);
    $stmt->execute();
    $stmt->close();


    $response = ["status" => "success", "message" => "Verification code resent to $email"];
    sendResponseAndContinue($response);
    sendOTPEmail($email, $verify_token, 'forgot');

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
    echo json_encode(["status" => "error", "message" => "Incorrect OTP. Please enter the correct one!"]);
  }
}
$conn->close();
exit;
