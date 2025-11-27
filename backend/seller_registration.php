<?php
session_start();
include("mail.php");
include("header.php");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    if (!isset($_SESSION['user_email'])) {
        echo json_encode(["status" => "error", "message" => "User not logged in"]);
        exit;
    }

    $user_email = $_SESSION['user_email'];

    // Fetch user
    $stmt = $conn->prepare("SELECT id FROM users WHERE email = ? LIMIT 1");
    $stmt->bind_param("s", $user_email);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();
    $stmt->close();

    if (!$user) {
        echo json_encode(["status" => "error", "message" => "User not found"]);
        exit;
    }

    $user_id = $user['id'];
    $action = $_POST['action'] ?? '';
    $store_email = strtolower(trim(filter_input(INPUT_POST, "businessEmail", FILTER_SANITIZE_EMAIL)));

    if (!filter_var($store_email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(["status" => "error", "message" => "Invalid email format"]);
        exit;
    }

    // SEND OTP
    if ($action === 'send') {
        $stmt = $conn->prepare("SELECT * FROM seller_unverified_email WHERE user_id = ? LIMIT 1");
        $stmt->bind_param("i", $user_id);
        $stmt->execute();
        $result = $stmt->get_result();
        $pending_seller = $result->fetch_assoc();
        $stmt->close();

        if ($result->num_rows > 0) {
            if ($pending_seller["unverified_email"] !== $store_email) {
                $stmt = $conn->prepare("UPDATE seller_unverified_email SET unverified_email = ? WHERE user_id = ?");
                $stmt->bind_param("si", $store_email, $user_id);
                $stmt->execute();
                $stmt->close();
            }
        } else {
            $verify_token = random_int(100000, 999999);

            $stmt = $conn->prepare("INSERT INTO seller_unverified_email (user_id, unverified_email, verify_token) VALUES (?, ?, ?)");
            $stmt->bind_param("isi", $user_id, $store_email, $verify_token);
            $stmt->execute();
            $stmt->close();

            $response = ["status" => "success", "message" => "Email sent to $store_email"];
            sendResponseAndContinue($response);
            sendSellerVerifyEmail($store_email, $verify_token);
            exit;
        }
    }

    // RESEND OTP
    if ($action === 'resend') {
        $verify_token = random_int(100000, 999999);
        $stmt = $conn->prepare("UPDATE seller_unverified_email SET verify_token = ? WHERE user_id = ?");
        $stmt->bind_param("ii", $verify_token, $user_id);
        $stmt->execute();
        $stmt->close();


        $response = json_encode(["status" => "success", "message" => "Email resent to $store_email"]);

        sendResponseAndContinue($response);
        sendSellerVerifyEmail($store_email, $verify_token);

        exit;
    }

    // VERIFY OTP
    if ($action === 'otp_verify') {
        $code = trim($_POST['code'] ?? '');
        $stmt = $conn->prepare("SELECT * FROM seller_unverified_email WHERE user_id = ? LIMIT 1");
        $stmt->bind_param("i", $user_id);
        $stmt->execute();
        $result = $stmt->get_result();
        $row = $result->fetch_assoc();
        $stmt->close();

        if ($row && $row['verify_token'] == $code) {
            echo json_encode(["status" => "email_verified"]);
            $del_stmt = $conn->prepare("DELETE FROM seller_unverified_email WHERE user_id = ?");
            $del_stmt->bind_param("i", $user_id);
            $del_stmt->execute();
            $del_stmt->close();
            exit;
        }
        echo json_encode(["status" => "error", "message" => "Incorrect OTP. Please enter the correct one!"]);
        exit;
    }

    // REGISTER SELLER
    if ($action === 'register') {
        $store_name = trim($_POST['storeName'] ?? '');
        $store_description = trim($_POST['storeDescription'] ?? '');
        $esewa_phone = trim($_POST['esewaPhone'] ?? '');
        $primary_category = trim($_POST['primaryCategory'] ?? '');
        $province = trim($_POST['province'] ?? '');
        $district = trim($_POST['district'] ?? '');
        $municipality = trim($_POST['municipality'] ?? '');
        $ward = trim($_POST['ward'] ?? '');

        if (!preg_match('/^98\d{8}$/', $esewa_phone)) {
            echo json_encode(["status" => "error", "message" => "Invalid eSewa phone number format"]);
            exit;
        }

        $check_stmt = $conn->prepare("SELECT id FROM sellers WHERE user_id = ? LIMIT 1");
        $check_stmt->bind_param("i", $user_id);
        $check_stmt->execute();
        $check_stmt->store_result();
        if ($check_stmt->num_rows > 0) {
            $check_stmt->close();
            echo json_encode(["status" => "error", "message" => "You already have a seller account"]);
            exit;
        }
        $check_stmt->close();

        // Upload logo
        $store_logo = null;
        if (isset($_FILES['logo']) && $_FILES['logo']['error'] === 0) {
            $file = $_FILES['logo'];
            $uploadDir = __DIR__ . '/seller_img_datas/seller_logos/';
            if (!is_dir($uploadDir)) mkdir($uploadDir, 0755, true);

            $fileExt = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
            $allowedExts = ['jpg', 'jpeg', 'png', 'gif'];
            if (!in_array($fileExt, $allowedExts)) {
                echo json_encode(['status' => 'error', 'message' => 'Invalid logo file type']);
                exit;
            }
            if ($file['size'] > 5 * 1024 * 1024) {
                echo json_encode(['status' => 'error', 'message' => 'Logo file too large']);
                exit;
            }

            $emailSafe = preg_replace('/[^a-z]/', '', explode('@', $user_email)[0]);
            $store_logo = 'logo_' . $emailSafe . '_' . bin2hex(random_bytes(8)) . '.' . $fileExt;
            if (!move_uploaded_file($file['tmp_name'], $uploadDir . $store_logo)) {
                echo json_encode(['status' => 'error', 'message' => 'Logo upload failed']);
                exit;
            }
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Store logo is required']);
            exit;
        }

        // Upload banner
        $store_banner = null;
        if (isset($_FILES['banner']) && $_FILES['banner']['error'] === 0) {
            $file = $_FILES['banner'];
            $uploadDir = __DIR__ . '/seller_img_datas/seller_banners/';
            if (!is_dir($uploadDir)) mkdir($uploadDir, 0755, true);

            $fileExt = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
            $allowedExts = ['jpg', 'jpeg', 'png', 'gif'];
            if (!in_array($fileExt, $allowedExts)) {
                echo json_encode(['status' => 'error', 'message' => 'Invalid banner file type']);
                exit;
            }
            if ($file['size'] > 6 * 1024 * 1024) {
                echo json_encode(['status' => 'error', 'message' => 'Banner file too large']);
                exit;
            }

            $emailSafe = preg_replace('/[^a-z]/', '', explode('@', $user_email)[0]);
            $store_banner = 'banner_' . $emailSafe . '_' . bin2hex(random_bytes(8)) . '.' . $fileExt;
            if (!move_uploaded_file($file['tmp_name'], $uploadDir . $store_banner)) {
                echo json_encode(['status' => 'error', 'message' => 'Banner upload failed']);
                exit;
            }
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Store banner is required']);
            exit;
        }


        $insert_stmt = $conn->prepare("INSERT INTO sellers (user_id, store_name, store_description, primary_category, store_email, esewa_phone, province, district, municipality, ward, store_logo, store_banner) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $insert_stmt->bind_param("isssssssssss", $user_id, $store_name, $store_description, $primary_category, $store_email, $esewa_phone, $province, $district, $municipality, $ward, $store_logo, $store_banner);
        if ($insert_stmt->execute()) {

            // Update role
            $current_role_stmt = $conn->prepare("SELECT role FROM users WHERE email = ? LIMIT 1");
            $current_role_stmt->bind_param("s", $user_email);
            $current_role_stmt->execute();
            $current_role_result = $current_role_stmt->get_result();
            $current_role = $current_role_result->fetch_assoc()['role'];
            $current_role_stmt->close();

            $new_role = ($current_role === 'teacher') ? 'seller_teacher' : 'seller';

            $update_role_stmt = $conn->prepare("UPDATE users SET role = ? WHERE email = ?");
            $update_role_stmt->bind_param("ss", $new_role, $user_email);
            $update_role_stmt->execute();
            $update_role_stmt->close();

            $check_stmt = $conn->prepare("SELECT id FROM sellers WHERE user_id = ? LIMIT 1");
            $check_stmt->bind_param("i", $user_id);
            $check_stmt->execute();
            $result = $check_stmt->get_result();
            $row = $result->fetch_assoc();

            $response = ["status" => "success"];
            sendResponseAndContinue($response);
            sendSellerAccountCreatedEmail($user_email);
            exit;
        } else {
            echo json_encode(["status" => "error", "message" => "Failed to activate account. Please try again later."]);
            exit;
        }
    }
}

$conn->close();
exit;
