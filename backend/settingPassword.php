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
    $hash_newPass = password_hash($newPassword, PASSWORD_ARGON2ID);
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

if($action === "resend_otp"){
        $response = ["status" => "otp_sent", "message" => "Verification code resent to $email"];
} else {
        $response = ["status" => "otp_sent", "message" => "Verification code sent to $email"];
}
        sendResponseAndContinue($response);
        sendOTPEmail($email, $verify_token, 'forgot');
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
