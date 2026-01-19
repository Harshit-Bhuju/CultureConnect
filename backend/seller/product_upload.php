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

    $seller_id = $user['seller_id'];

    // Get and sanitize form data
    $product_name = trim($_POST['productName'] ?? '');
    $product_type = trim($_POST['productType'] ?? '');
    $category = trim($_POST['category'] ?? '');
    $culture = trim($_POST['culture'] ?? '');
    $audience = trim($_POST['audience'] ?? '');
    $description = trim($_POST['description'] ?? '');
    $price = trim($_POST['price'] ?? '');
    $stock = trim($_POST['stock'] ?? '');
    $dimensions = trim($_POST['dimensions'] ?? '');
    $material = trim($_POST['material'] ?? '');
    $care_instructions = trim($_POST['careInstructions'] ?? '');
    $status = trim($_POST['status'] ?? 'draft'); // 'draft' or 'published'

    // Get arrays
    $tags = isset($_POST['tags']) ? json_decode($_POST['tags'], true) : [];
    $adult_sizes = isset($_POST['adultSizes']) ? json_decode($_POST['adultSizes'], true) : [];
    $child_age_groups = isset($_POST['childAgeGroups']) ? json_decode($_POST['childAgeGroups'], true) : [];

    // Basic validation
    if (empty($product_name) || strlen($product_name) < 3 || strlen($product_name) > 100) {
        echo json_encode(["status" => "error", "message" => "Invalid product name"]);
        exit;
    }

    if (empty($product_type)) {
        echo json_encode(["status" => "error", "message" => "Product type is required"]);
        exit;
    }

    if (!in_array($category, ['cultural-clothes', 'musical-instruments', 'handicraft-decors'])) {
        echo json_encode(["status" => "error", "message" => "Invalid category"]);
        exit;
    }

    // Validation for cultural-clothes only
    if ($category === 'cultural-clothes') {
        if (empty($culture)) {
            echo json_encode(["status" => "error", "message" => "Culture is required for cultural clothes"]);
            exit;
        }

        if (empty($audience)) {
            echo json_encode(["status" => "error", "message" => "Audience is required for cultural clothes"]);
            exit;
        }

        if (!in_array($audience, ['men', 'women', 'boy', 'girl'])) {
            echo json_encode(["status" => "error", "message" => "Invalid audience"]);
            exit;
        }

        // Validate sizes/age groups based on audience
        if (($audience === 'men' || $audience === 'women') && empty($adult_sizes)) {
            echo json_encode(["status" => "error", "message" => "At least one size is required for adult clothing"]);
            exit;
        }

        if (($audience === 'boy' || $audience === 'girl') && empty($child_age_groups)) {
            echo json_encode(["status" => "error", "message" => "At least one age group is required for children's clothing"]);
            exit;
        }
    }

    if (empty($description) || strlen($description) < 10 || strlen($description) > 2000) {
        echo json_encode(["status" => "error", "message" => "Invalid description"]);
        exit;
    }

    if (!is_numeric($price) || $price <= 0) {
        echo json_encode(["status" => "error", "message" => "Invalid price"]);
        exit;
    }

    if (!is_numeric($stock) || $stock < 0) {
        echo json_encode(["status" => "error", "message" => "Invalid stock quantity"]);
        exit;
    }

    if (!in_array($status, ['draft', 'published'])) {
        echo json_encode(["status" => "error", "message" => "Invalid status"]);
        exit;
    }

    // Validate tags
    if (empty($tags) || !is_array($tags)) {
        echo json_encode(["status" => "error", "message" => "At least one tag is required"]);
        exit;
    }

    if (count($tags) > 10) {
        echo json_encode(["status" => "error", "message" => "Maximum 10 tags allowed"]);
        exit;
    }

    // Optional fields validation (only if provided)
    if (!empty($dimensions) && !preg_match('/^\d+(\.\d+)?\s*\*\s*\d+(\.\d+)?\s*\*\s*\d+(\.\d+)?$/', $dimensions)) {
        echo json_encode(["status" => "error", "message" => "Invalid dimensions format"]);
        exit;
    }

    // Handle image uploads
    if (!isset($_FILES['images']) || empty($_FILES['images']['name'][0])) {
        echo json_encode(["status" => "error", "message" => "At least one product image is required"]);
        exit;
    }


    $uploadDir = __DIR__ . '/../../uploads/product_images/';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }

    $uploadedImages = [];
    $allowedExts = ['jpg', 'jpeg', 'png', 'gif'];
    $maxFileSize = 5 * 1024 * 1024; // 5MB

    foreach ($_FILES['images']['tmp_name'] as $key => $tmpName) {
        if ($_FILES['images']['error'][$key] !== 0) {
            continue;
        }

        // Validate image
        if (!getimagesize($tmpName)) {
            echo json_encode(["status" => "error", "message" => "Invalid image file"]);
            exit;
        }

        $fileName = $_FILES['images']['name'][$key];
        $fileSize = $_FILES['images']['size'][$key];
        $fileExt = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));

        if (!in_array($fileExt, $allowedExts)) {
            echo json_encode(["status" => "error", "message" => "Invalid image file type. Only JPG, PNG, GIF allowed"]);
            exit;
        }

        if ($fileSize > $maxFileSize) {
            echo json_encode(["status" => "error", "message" => "Image file too large. Maximum 5MB"]);
            exit;
        }

        // Generate unique filename
        $newFileName = 'product_' . $seller_id . '_' . bin2hex(random_bytes(8)) . '.' . $fileExt;
        $targetPath = $uploadDir . $newFileName;

        if (!move_uploaded_file($tmpName, $targetPath)) {
            echo json_encode(["status" => "error", "message" => "Failed to upload image"]);
            exit;
        }

        $uploadedImages[] = $newFileName;
    }

    if (count($uploadedImages) === 0) {
        echo json_encode(["status" => "error", "message" => "No valid images uploaded"]);
        exit;
    }

    if (count($uploadedImages) > 10) {
        echo json_encode(["status" => "error", "message" => "Maximum 10 images allowed"]);
        exit;
    }

    // Start transaction
    $conn->begin_transaction();

    try {
        // Insert into products table
        $stmt = $conn->prepare("INSERT INTO products (seller_id, product_name, product_type, category, audience, price, stock, description, material, dimensions, care_instructions, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

        // Handle optional fields - only set audience for cultural-clothes
        $audience_value = ($category === 'cultural-clothes' && !empty($audience)) ? $audience : null;
        $material_value = !empty($material) ? $material : null;
        $dimensions_value = !empty($dimensions) ? $dimensions : null;
        $care_value = !empty($care_instructions) ? $care_instructions : null;

        $stmt->bind_param(
            "issssdisssss",
            $seller_id,
            $product_name,
            $product_type,
            $category,
            $audience_value,
            $price,
            $stock,
            $description,
            $material_value,
            $dimensions_value,
            $care_value,
            $status
        );

        if (!$stmt->execute()) {
            throw new Exception("Failed to insert product");
        }

        $product_id = $stmt->insert_id;
        $stmt->close();

        // Insert product images with order
        $stmt = $conn->prepare("INSERT INTO product_images (product_id, image_url, `order`) VALUES (?, ?, ?)");
        $imageOrder = 1;
        foreach ($uploadedImages as $imageName) {
            $stmt->bind_param("isi", $product_id, $imageName, $imageOrder);
            if (!$stmt->execute()) {
                throw new Exception("Failed to insert product image");
            }
            $imageOrder++;
        }
        $stmt->close();
        // Insert tags
        if (!empty($tags)) {
            $stmt = $conn->prepare("INSERT INTO product_tags (product_id, tag) VALUES (?, ?)");
            foreach ($tags as $tag) {
                $tag = trim($tag);
                if (!empty($tag) && strlen($tag) <= 50) {
                    $stmt->bind_param("is", $product_id, $tag);
                    if (!$stmt->execute()) {
                        throw new Exception("Failed to insert tag");
                    }
                }
            }
            $stmt->close();
        }

        if ($category === 'cultural-clothes') {

            // Fetch all size_age_options from DB
            $size_age_map = [];
            $result = $conn->query("SELECT id, gender, age_group, size_available FROM size_age_options");
            while ($row = $result->fetch_assoc()) {
                $key = strtolower($row['gender']) . '_';
                if (!empty($row['age_group'])) {
                    $key .= $row['age_group']; // e.g., 'boy_5-6'
                } elseif (!empty($row['size_available'])) {
                    $key .= $row['size_available']; // e.g., 'men_S'
                }
                $size_age_map[$key] = $row['id'];
            }

            // Prepare insert statement for product_clothes
            $stmt = $conn->prepare("INSERT INTO product_clothes (product_id, size_age_id, culture) VALUES (?, ?, ?)");

            if (!empty($adult_sizes) && ($audience === 'men' || $audience === 'women')) {
                $gender = strtolower($audience);
                foreach ($adult_sizes as $size) {
                    $key = $gender . '_' . $size;
                    if (isset($size_age_map[$key])) {
                        $size_age_id = $size_age_map[$key];
                        $stmt->bind_param("iis", $product_id, $size_age_id, $culture);
                        if (!$stmt->execute()) {
                            throw new Exception("Failed to insert size option");
                        }
                    }
                }
            }

            if (!empty($child_age_groups) && ($audience === 'boy' || $audience === 'girl')) {
                $gender = strtolower($audience);
                foreach ($child_age_groups as $ageGroup) {
                    $key = $gender . '_' . $ageGroup;
                    if (isset($size_age_map[$key])) {
                        $size_age_id = $size_age_map[$key];
                        $stmt->bind_param("iis", $product_id, $size_age_id, $culture);
                        if (!$stmt->execute()) {
                            throw new Exception("Failed to insert age group option");
                        }
                    }
                }
            }

            $stmt->close();
        } elseif ($category === 'musical-instruments') {
            // Insert into product_instruments
            $stmt = $conn->prepare("INSERT INTO product_instruments (product_id) VALUES (?)");
            $stmt->bind_param("i", $product_id);
            if (!$stmt->execute()) {
                throw new Exception("Failed to insert instrument");
            }
            $stmt->close();
        } elseif ($category === 'handicraft-decors') {
            // Insert into product_arts
            $stmt = $conn->prepare("INSERT INTO product_arts (product_id) VALUES (?)");
            $stmt->bind_param("i", $product_id);
            if (!$stmt->execute()) {
                throw new Exception("Failed to insert art/decor");
            }
            $stmt->close();
        }

        // Commit transaction
        $conn->commit();

        echo json_encode([
            "status" => "success",
            "message" => $status === 'published' ? "Product published successfully" : "Draft saved successfully",
            "product_id" => $product_id
        ]);
    } catch (Exception $e) {
        // Rollback on error
        $conn->rollback();

        // Delete uploaded images
        foreach ($uploadedImages as $imageName) {
            $filePath = $uploadDir . $imageName;
            if (file_exists($filePath)) {
                unlink($filePath);
            }
        }

        echo json_encode([
            "status" => "error",
            "message" => "Failed to save product: " . $e->getMessage()
        ]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Invalid request method"]);
}

$conn->close();
exit;
