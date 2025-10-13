<?php
include("header.php");
session_start();
include("username_gen.php");


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

    if ($user['password']) {
        $stmt = $conn->prepare("UPDATE pending_users SET password = NULL WHERE email = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $stmt->close();
    }

    if ($user && $user['password'] === NULL) {
        $hash = password_hash($password, PASSWORD_ARGON2ID);
        $picture = $user['profile_pic'];

        // Insert new user
        $stmt = $conn->prepare("INSERT INTO users(email, username, profile_pic, password) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("ssss", $email, $username, $picture, $hash);
        $inserted = $stmt->execute();
        $stmt->close();

        if ($inserted) {
            // Delete from pending
            $stmt = $conn->prepare("DELETE FROM pending_users WHERE email = ? LIMIT 1");
            $stmt->bind_param("s", $email);
            $deleted = $stmt->execute();
            $stmt->close();

            if ($deleted) {
                $_SESSION['user_email'] = $email;
                $_SESSION['logged_in'] = true;
                $_SESSION['last_activity'] = time();
                unset($_SESSION['google_email']);

                $stmt_gen = $conn->prepare("SELECT gender, location FROM users WHERE email = ? LIMIT 1");
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
                        "avatar" => $picture
                    ]
                ]);
            } else {
                echo json_encode(["status" => "error", "message" => "Failed to remove pending user."]);
            }
        } else {
            echo json_encode(["status" => "error", "message" => "Failed to create user."]);
        }
    } else {
        // ✅ If user not found or password already set
        echo json_encode(["status" => "error", "message" => "Invalid or already registered user."]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Invalid request method."]);
}

$conn->close();
exit;
