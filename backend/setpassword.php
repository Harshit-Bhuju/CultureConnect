<?php
session_start();
include("dbconnect.php");
include("username_gen.php");

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = $_SESSION['google_email'] ?? '';

    if (empty($email)) {
        echo json_encode(["status" => "error", "message" => "Session expired. Please login with Google again."]);
        exit;
    }
    $username = generateSignupUsername($email, $conn);

    $password = trim($_POST['password'] ?? "");

    $stmt = $conn->prepare("SELECT * FROM pending_users WHERE email = ? LIMIT 1");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();
    $stmt->close();


    $hash = password_hash($password, PASSWORD_ARGON2ID);
    if ($user && $user['password'] == NULL) {
        $picture = $user['profile_pic'];
        $stmt = $conn->prepare("INSERT INTO users(email,username,profile_pic,password) VALUES(?,?,?,?)");
        $stmt->bind_param("ssss", $email, $username, $picture, $hash);
        $stmt->execute();

        $stmt = $conn->prepare("DELETE FROM pending_users WHERE email = ? LIMIT 1");
        $stmt->bind_param("s", $email);

        if ($stmt->execute()) {
            $_SESSION['user_email'] = $email;
            $_SESSION['logged_in'] = true;
            $_SESSION['last_activity'] = time();
            unset($_SESSION['google_email']);

            $stmt_gen = $conn->prepare("SELECT gender,location FROM users WHERE email = ? LIMIT 1");
            $stmt_gen->bind_param("s", $email);
            $stmt_gen->execute();
            $result_gen = $stmt_gen->get_result();
            $user_gen = $result_gen->fetch_assoc();
            $stmt_gen->close();

            echo json_encode([
                "status" => "success",
                "message" => "Password set successfully!",
                "user" => [
                    "email" => $email,
                    "name" => $username,
                    "gender" => $user_gen['gender'] ?? '',
                    "location" => $user_gen['location'] ?? '',
                    "picture" => $picture
                ]
            ]);
        } else {
            echo json_encode(["status" => "error", "message" => "Failed to set password."]);
        }

        $stmt->close();
    }
}

$conn->close();
exit;
