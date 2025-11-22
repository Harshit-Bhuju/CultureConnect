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
                $_SESSION['user_email'] = $email;
                $_SESSION['logged_in'] = true;
                unset($_SESSION['google_email']);

                $stmt_gen = $conn->prepare("SELECT gender, province, district, municipality, ward FROM users WHERE email = ? LIMIT 1");
                $stmt_gen->bind_param("s", $email);
                $stmt_gen->execute();
                $result_gen = $stmt_gen->get_result();
                $user_gen = $result_gen->fetch_assoc();
                $stmt_gen->close();

                $subject = 'Your CultureConnect Account is Ready';
                $custom_template = "
    <html>
    <head>
        <style>
            body {
                font-family: Arial, sans-serif;
                background: #f2f5f7;
                margin: 0;
                padding: 0;
            }
            .container {
                max-width: 600px;
                margin: 40px auto;
                padding: 20px;
            }
            .card {
                background: #ffffff;
                border-radius: 14px;
                box-shadow: 0 8px 20px rgba(0,0,0,0.1);
                padding: 40px 30px;
                text-align: center;
            }
            .title {
                font-size: 30px;
                font-weight: bold;
                color: #4a90e2;
                margin-bottom: 20px;
            }
            .message {
                font-size: 16px;
                color: #555555;
                margin-bottom: 30px;
                line-height: 1.6;
            }
            .highlight-box {
                display: inline-block;
                background: linear-gradient(90deg, #ffb347, #ffcc33);
                color: #ffffff;
                padding: 18px 40px;
                font-size: 20px;
                font-weight: bold;
                border-radius: 10px;
                letter-spacing: 1px;
                box-shadow: 0 5px 12px rgba(0,0,0,0.2);
            }
            .footer {
                margin-top: 35px;
                font-size: 14px;
                color: #777777;
                line-height: 1.5;
            }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='card'>
                <div class='title'>Thank You for Joining CultureConnect!</div>
                <div class='message'>
                    We're thrilled to have you on board. Your account has been successfully created, and you now have full access to explore, connect, and enjoy everything <strong>CultureConnect</strong> offers.
                </div>
                <div class='highlight-box'>Account Created Successfully 🎉</div>
                <div class='footer'>
                    If you did not create this account, please contact our support immediately.<br>
                    We’re excited to have you with us!<br>- The <span style='color:red;'>CultureConnect</span> Team
                </div>
            </div>
        </div>
    </body>
</html>

        ";
                $response = json_encode([
                    "status" => "success",
                    "message" => "Password set successfully!",
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

                        "avatar" => $picture
                    ]
                ]);
                header("Connection: close");
                header("Content-Type: application/json");
                header("Content-Length: " . strlen($response));
                echo $response;
                ob_flush();
                flush();

                ignore_user_abort(true);
                sendemail_verify($email, $subject, $custom_template);
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
