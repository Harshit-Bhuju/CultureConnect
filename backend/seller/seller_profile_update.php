<?php
require_once __DIR__ . '/../config/session_config.php';
include("../config/header.php");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    // Check if user is logged in
    if (!isset($_SESSION['user_email'])) {
        echo json_encode(["status" => "error", "message" => "User not logged in"]);
        exit;
    }

    $user_email = $_SESSION['user_email'];

    // Fetch user and seller info
    $stmt = $conn->prepare("SELECT u.id, s.id as seller_id FROM users u LEFT JOIN sellers s ON u.id = s.user_id WHERE u.email = ? LIMIT 1");
    $stmt->bind_param("s", $user_email);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();
    $stmt->close();

    if (!$user) {
        echo json_encode(["status" => "error", "message" => "User not found"]);
        exit;
    }

    if (!$user['seller_id']) {
        echo json_encode(["status" => "error", "message" => "No seller account found"]);
        exit;
    }

    $user_id = $user['id'];
    $seller_id = $user['seller_id'];

    // Get current seller data
    $stmt = $conn->prepare("SELECT * FROM sellers WHERE id = ? LIMIT 1");
    $stmt->bind_param("i", $seller_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $current_seller = $result->fetch_assoc();
    $stmt->close();

    if (!$current_seller) {
        echo json_encode(["status" => "error", "message" => "Seller data not found"]);
        exit;
    }

    // Sanitize and normalize inputs (keep old values when empty)
    $store_name_raw = trim($_POST['storeName'] ?? '');
    $store_name = $store_name_raw === '' ? $current_seller['store_name'] : ucwords(strtolower($store_name_raw));

    $store_description_raw = trim($_POST['storeDescription'] ?? '');
    $store_description = $store_description_raw === '' ? $current_seller['store_description'] : htmlspecialchars($store_description_raw, ENT_QUOTES);

    $esewa_phone_raw = trim($_POST['esewaPhone'] ?? '');
    $esewa_phone = $esewa_phone_raw === '' ? $current_seller['esewa_phone'] : htmlspecialchars($esewa_phone_raw, ENT_QUOTES);
    if (!preg_match('/^98\d{8}$/', $esewa_phone)) {
        echo json_encode(["status" => "error", "message" => "Invalid eSewa phone number format"]);
        exit;
    }

    $primary_category_raw = trim($_POST['primaryCategory'] ?? '');
    $primary_category = $primary_category_raw === '' ? $current_seller['primary_category'] : htmlspecialchars($primary_category_raw, ENT_QUOTES);

    $province_raw = trim($_POST['province'] ?? '');
    $province = $province_raw === '' ? $current_seller['province'] : htmlspecialchars($province_raw, ENT_QUOTES);

    $district_raw = trim($_POST['district'] ?? '');
    $district = $district_raw === '' ? $current_seller['district'] : htmlspecialchars($district_raw, ENT_QUOTES);

    $municipality_raw = trim($_POST['municipality'] ?? '');
    $municipality = $municipality_raw === '' ? $current_seller['municipality'] : htmlspecialchars($municipality_raw, ENT_QUOTES);

    $ward_raw = trim($_POST['ward'] ?? '');
    $ward = $ward_raw === '' ? $current_seller['ward'] : htmlspecialchars($ward_raw, ENT_QUOTES);

    // Handle store logo upload (keep old if none)
    $store_logo = $current_seller['store_logo'];
    if (isset($_FILES['logo']) && $_FILES['logo']['error'] === 0) {
        $file = $_FILES['logo'];
        $uploadDir = dirname(__DIR__) . '/uploads/seller_img_datas/seller_logos/';
        if (!is_dir($uploadDir)) mkdir($uploadDir, 0755, true);

        $fileExt = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        //very important to check if the file is an image
        if (!getimagesize($_FILES['logo']['tmp_name'])) {
            echo json_encode(["status" => "error", "message" => "Not a valid image."]);
            exit;
        }
        $allowedExts = ['jpg', 'jpeg', 'png', 'gif'];
        if (!in_array($fileExt, $allowedExts)) {
            echo json_encode(['status' => 'error', 'message' => 'Invalid banner file type']);
            exit;
        }

        if ($file['size'] > 5 * 1024 * 1024) {
            echo json_encode(['status' => 'error', 'message' => 'Logo file too large. Maximum 5MB']);
            exit;
        }

        // Delete old logo if exists and not empty
        if (!empty($current_seller['store_logo']) && file_exists($uploadDir . $current_seller['store_logo'])) {
            unlink($uploadDir . $current_seller['store_logo']);
        }

        $emailSafe = preg_replace('/[^a-z]/', '', explode('@', $user_email)[0]);
        $store_logo_new = 'logo_' . $emailSafe . '_' . bin2hex(random_bytes(8)) . '.' . $fileExt;

        if (!move_uploaded_file($file['tmp_name'], $uploadDir . $store_logo_new)) {
            echo json_encode(['status' => 'error', 'message' => 'Logo upload failed']);
            exit;
        }

        $store_logo = $store_logo_new;
    }

    // Handle store banner upload (keep old if none)
    $store_banner = $current_seller['store_banner'];
    if (isset($_FILES['banner']) && $_FILES['banner']['error'] === 0) {
        $file = $_FILES['banner'];
        $uploadDir = dirname(__DIR__) . '/uploads/seller_img_datas/seller_banners/';
        if (!is_dir($uploadDir)) mkdir($uploadDir, 0755, true);

        $fileExt = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        //very important to check if the file is an image
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
            echo json_encode(['status' => 'error', 'message' => 'Banner file too large. Maximum 6MB']);
            exit;
        }

        // Delete old banner if exists and not empty
        if (!empty($current_seller['store_banner']) && file_exists($uploadDir . $current_seller['store_banner'])) {
            unlink($uploadDir . $current_seller['store_banner']);
        }

        $emailSafe = preg_replace('/[^a-z]/', '', explode('@', $user_email)[0]);
        $store_banner_new = 'banner_' . $emailSafe . '_' . bin2hex(random_bytes(8)) . '.' . $fileExt;

        if (!move_uploaded_file($file['tmp_name'], $uploadDir . $store_banner_new)) {
            echo json_encode(['status' => 'error', 'message' => 'Banner upload failed']);
            exit;
        }

        $store_banner = $store_banner_new;
    }

    // Build dynamic update (only changed fields)
    $updates = [];
    $params = [];
    $types = "";

    if ($store_name !== $current_seller['store_name']) {
        $updates[] = "store_name=?";
        $params[] = $store_name;
        $types .= "s";
    }
    if ($store_description !== $current_seller['store_description']) {
        $updates[] = "store_description=?";
        $params[] = $store_description;
        $types .= "s";
    }
    if ($esewa_phone !== $current_seller['esewa_phone']) {
        $updates[] = "esewa_phone=?";
        $params[] = $esewa_phone;
        $types .= "s";
    }
    if ($primary_category !== $current_seller['primary_category']) {
        $updates[] = "primary_category=?";
        $params[] = $primary_category;
        $types .= "s";
    }
    if ($province !== $current_seller['province']) {
        $updates[] = "province=?";
        $params[] = $province;
        $types .= "s";
    }
    if ($district !== $current_seller['district']) {
        $updates[] = "district=?";
        $params[] = $district;
        $types .= "s";
    }
    if ($municipality !== $current_seller['municipality']) {
        $updates[] = "municipality=?";
        $params[] = $municipality;
        $types .= "s";
    }
    if ($ward !== $current_seller['ward']) {
        $updates[] = "ward=?";
        $params[] = $ward;
        $types .= "s";
    }
    if ($store_logo !== $current_seller['store_logo']) {
        $updates[] = "store_logo=?";
        $params[] = $store_logo;
        $types .= "s";
    }
    if ($store_banner !== $current_seller['store_banner']) {
        $updates[] = "store_banner=?";
        $params[] = $store_banner;
        $types .= "s";
    }

    // If no changes detected
    if (count($updates) === 0) {
        echo json_encode(["status" => "success", "message" => "No changes detected"]);
        $conn->close();
        exit;
    }

    // Build query and bind params
    $query = "UPDATE sellers SET " . implode(", ", $updates) . " WHERE id=?";
    $params[] = $seller_id;
    $types .= "i";

    $stmt = $conn->prepare($query);
    // Bind params dynamically (assuming PHP supports argument unpacking in your environment)
    $stmt->bind_param($types, ...$params);

    if ($stmt->execute()) {
        $stmt->close();
        echo json_encode([
            "status" => "success",
            "message" => "Profile updated successfully",
            'data' => ['seller_id' => $seller_id]

        ]);
    } else {
        echo json_encode(["status" => "error", "message" => "Failed to update profile"]);
    }
}

$conn->close();
exit;
