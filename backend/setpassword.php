<?php
session_start();
include("header.php");
include("mail.php");
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

        $stmt = $conn->prepare("INSERT INTO users(email, username, profile_pic, password) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("ssss", $email, $username, $picture, $hash);
        $inserted = $stmt->execute();
        $stmt->close();

        if ($inserted) {
            $stmt = $conn->prepare("DELETE FROM pending_users WHERE email = ? LIMIT 1");
            $stmt->bind_param("s", $email);
            $deleted = $stmt->execute();
            $stmt->close();

            if ($deleted) {
                session_regenerate_id(true);
                $_SESSION['user_email'] = $email;
                $_SESSION['logged_in'] = true;
                unset($_SESSION['google_email']);

                $stmt_gen = $conn->prepare("SELECT gender, province, district, municipality, ward FROM users WHERE email = ? LIMIT 1");
                $stmt_gen->bind_param("s", $email);
                $stmt_gen->execute();
                $result_gen = $stmt_gen->get_result();
                $user_gen = $result_gen->fetch_assoc();
                $stmt_gen->close();


                $response = [
                    "status" => "success",
                    "message" => "Account Created Successfully!",
                    "user" => [
                        "email" => $email,
                        "name" => $username,
                        "gender" => $user_gen['gender'] ?? '',
                        "location" => [
                            "province" => $user_gen['province'] ?? '',
                            "district" => $user_gen['district'] ?? '',
                            "municipality" => $user_gen['municipality'] ?? '',
                            "ward" => $user_gen['ward'] ?? ''
                        ],
                        "avatar" => $picture,
                        "seller_id" =>  null,
                        "teacher_id" => null
                    ]
                ];
                sendResponseAndContinue($response);
                sendAccountCreatedEmail($email);
            } else {
                echo json_encode(["status" => "error", "message" => "Failed to remove pending user."]);
            }
        } else {
            echo json_encode(["status" => "error", "message" => "Failed to create user."]);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "Invalid or already registered user."]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Invalid request method."]);
}

$conn->close();
exit;
