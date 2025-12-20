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

    // Fetch user along with seller_id and teacher_id
    $stmt = $conn->prepare("
        SELECT 
            u.*, 
            s.id AS seller_id,
        t.id AS teacher_id,
        t.status AS teacher_status
        FROM users u
        LEFT JOIN sellers s ON u.id = s.user_id
        LEFT JOIN teachers t ON u.id = t.user_id
        WHERE u.email = ?
        LIMIT 1
    ");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();
    $stmt->close();

    if ($result && $result->num_rows > 0) {
        $row = $result->fetch_assoc();

        // Update profile pic if changed
        if (!empty($row['password']) && $row['profile_pic'] == "default-image.jpg") {
            $stmt = $conn->prepare("UPDATE users SET profile_pic = ? WHERE email = ?");
            $stmt->bind_param("ss", $picture, $email);
            $stmt->execute();
            $stmt->close();

            $row['profile_pic'] = $picture;
        }
        session_regenerate_id(true);
        $_SESSION['user_email'] = $email;
        $_SESSION['logged_in'] = true;

        echo json_encode([
            "status" => "not_null",
            "user" => [
                "email" => $row['email'],
                "name" => $row['username'],
                "gender" => $row['gender'],
                "location" => [
                    "province" => $row['province'] ?? '',
                    "district" => $row['district'] ?? '',
                    "municipality" => $row['municipality'] ?? '',
                    "ward" => $row['ward'] ?? ''
                ],
                "avatar" => $row['profile_pic'],
                "role" => $row['role'],
                "seller_id" => $row['seller_id'] ?? null,
                "teacher_id" => $row['teacher_id'] ?? null,
                "teacher_status" => $row['teacher_status'] ?? null
            ]
        ]);
        exit;
    }

    // If user not found in users table, handle pending_users
    $stmt = $conn->prepare("SELECT email FROM pending_users WHERE email = ? LIMIT 1");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();
    $stmt->close();

    if ($result->num_rows > 0) {
        $stmt = $conn->prepare("DELETE FROM pending_users WHERE email = ? LIMIT 1");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $stmt->close();
    }

    $stmt = $conn->prepare("INSERT INTO pending_users (email, profile_pic) VALUES (?, ?)");
    $stmt->bind_param("ss", $email, $picture);
    $stmt->execute();
    $stmt->close();
    session_regenerate_id(true);
    $_SESSION['google_email'] = $email;

    echo json_encode(["status" => "null"]);
}

$conn->close();
exit;
