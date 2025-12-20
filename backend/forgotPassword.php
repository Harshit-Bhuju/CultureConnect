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
    session_regenerate_id(true);
    $_SESSION['forgot_email'] = $email;

    $response = ["status" => "success", "message" => "Code sent to $email"];
    sendResponseAndContinue($response);
    sendOTPEmail($email, $verify_token, 'forgot');
    exit();
  }
}

$conn->close();
exit;
