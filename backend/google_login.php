<?php
session_start();
include("header.php");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $email = strtolower(trim(filter_input(INPUT_POST, "email", FILTER_SANITIZE_EMAIL)));
    $picture = trim($_POST['picture'] ?? '');

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(["status" => "error", "message" => "Invalid email format."]);
        exit;
    }

    $stmt = $conn->prepare("SELECT * FROM users WHERE email = ? LIMIT 1");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();
    $stmt->close();

    if ($result && $result->num_rows > 0) {
        $row = $result->fetch_assoc();


        if (!empty($row['password'])) {
            if ($row['profile_pic'] !== $picture) {
                $stmt = $conn->prepare("UPDATE users SET profile_pic = ? WHERE email = ?");
                $stmt->bind_param("ss", $picture, $email);
                $stmt->execute();
                $stmt->close();

                $row['profile_pic'] = $picture;
            }
            $_SESSION['user_email'] = $email;
            $_SESSION['logged_in'] = true;

            echo json_encode([
                "status" => "not_null",
                "user" => [
                    "email" => $row['email'],
                    "name" => $row['username'],
                    "gender" => $row['gender'],
                    "location" => [
                        "province" => $user['province'] ?? '',
                        "district" => $user['district'] ?? '',
                        "municipality" => $user['municipality'] ?? '',
                        "ward" => $user['ward'] ?? ''
                    ],
                    "avatar" => $row['profile_pic'],
                ]
            ]);
            exit;
        }
    }

    $stmt = $conn->prepare("SELECT email FROM pending_users WHERE email = ? LIMIT 1");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();
    $stmt->close();

    if ($result->num_rows > 0) {
        $stmt = $conn->prepare("DELETE FROM pending_users WHERE email = ? LIMIT 1");
        $stmt->bind_param("s", $email);
        $deleted = $stmt->execute();
        $stmt->close();
    }

    $stmt = $conn->prepare("INSERT INTO pending_users (email, profile_pic) VALUES (?, ?)");
    $stmt->bind_param("ss", $email, $picture);
    $stmt->execute();
    $stmt->close();

    $_SESSION['google_email'] = $email;

    echo json_encode([
        "status" => "null",
        "user" => [
            "email" => $email,
            "avatar" => $picture
        ]
    ]);
}

$conn->close();
exit;
