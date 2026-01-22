<?php
require_once __DIR__ . '/../config/session_config.php';
include("../config/mail.php");
include("../config/header.php");

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

    $store_name = ucwords(strtolower(trim($_POST['storeName'] ?? '')));
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
        $uploadDir = dirname(__DIR__) . '/uploads/seller_img_datas/seller_logos/';
        if (!is_dir($uploadDir)) mkdir($uploadDir, 0755, true);

        $fileExt = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        if (!getimagesize($_FILES['logo']['tmp_name'])) {
            echo json_encode(["status" => "error", "message" => "Not a valid image."]);
            exit;
        }
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
        $uploadDir = dirname(__DIR__) . '/uploads/seller_img_datas/seller_banners/';
        if (!is_dir($uploadDir)) mkdir($uploadDir, 0755, true);

        $fileExt = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        if (!getimagesize($_FILES['banner']['tmp_name'])) {
            echo json_encode(["status" => "error", "message" => "Not a valid image."]);
            exit;
        }
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

    // Start database transaction
    $conn->begin_transaction();

    try {
        $insert_stmt = $conn->prepare("INSERT INTO sellers (user_id, store_name, store_description, primary_category, esewa_phone, province, district, municipality, ward, store_logo, store_banner) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $insert_stmt->bind_param("issssssssss", $user_id, $store_name, $store_description, $primary_category, $esewa_phone, $province, $district, $municipality, $ward, $store_logo, $store_banner);

        if (!$insert_stmt->execute()) {
            throw new Exception("Failed to create seller record");
        }

        $seller_id = $insert_stmt->insert_id;
        $insert_stmt->close();

        $current_role_stmt = $conn->prepare("SELECT role FROM users WHERE email = ? LIMIT 1");
        $current_role_stmt->bind_param("s", $user_email);
        $current_role_stmt->execute();
        $current_role_result = $current_role_stmt->get_result();
        $current_role = $current_role_result->fetch_assoc()['role'];
        $current_role_stmt->close();

        $new_role = ($current_role === 'teacher') ? 'seller_teacher' : 'seller';

        $update_role_stmt = $conn->prepare("UPDATE users SET role = ? WHERE email = ?");
        $update_role_stmt->bind_param("ss", $new_role, $user_email);

        if (!$update_role_stmt->execute()) {
            throw new Exception("Failed to update user role");
        }
        $update_role_stmt->close();

        // Commit transaction
        $conn->commit();

        $response = ["status" => "success", "seller_id" => $seller_id];
        sendResponseAndContinue($response);
        sendSellerAccountCreatedEmail($user_email);
        exit;
    } catch (Exception $e) {
        // Rollback transaction on any error
        $conn->rollback();

        // Optionally delete uploaded files if they exist
        if ($store_logo) {
            @unlink(dirname(__DIR__) . '/uploads/seller_img_datas/seller_logos/' . $store_logo);
        }
        if ($store_banner) {
            @unlink(dirname(__DIR__) . '/uploads/seller_img_datas/seller_banners/' . $store_banner);
        }

        echo json_encode(["status" => "error", "message" => $e->getMessage()]);
        exit;
    }
}

$conn->close();
exit;
