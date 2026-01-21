<?php
require_once __DIR__ . '/../config/session_config.php';
header('Content-Type: application/json');
include("../config/header.php");

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["status" => "error", "message" => "Invalid request method"]);
    exit;
}

// Check if user is logged in
if (!isset($_SESSION['user_email'])) {
    echo json_encode(["status" => "error", "message" => "User not logged in"]);
    exit;
}

$user_email = $_SESSION['user_email'];

// Get product ID
$product_id = intval($_POST['productId'] ?? 0);
if ($product_id <= 0) {
    echo json_encode(["status" => "error", "message" => "Invalid product ID"]);
    exit;
}

// Verify seller owns this product
$stmt = $conn->prepare("SELECT p.*, s.id as seller_id FROM products p 
                        INNER JOIN sellers s ON p.seller_id = s.id 
                        INNER JOIN users u ON s.user_id = u.id 
                        WHERE p.id = ? AND u.email = ? LIMIT 1");
$stmt->bind_param("is", $product_id, $user_email);
$stmt->execute();
$result = $stmt->get_result();
$current_product = $result->fetch_assoc();
$stmt->close();

if (!$current_product) {
    echo json_encode(["status" => "error", "message" => "Product not found or access denied"]);
    exit;
}

$seller_id = $current_product['seller_id'];

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
$status = trim($_POST['status'] ?? 'draft');

// Get arrays
$tags = isset($_POST['tags']) ? json_decode($_POST['tags'], true) : [];
$adult_sizes = isset($_POST['adultSizes']) ? json_decode($_POST['adultSizes'], true) : [];
$child_age_groups = isset($_POST['childAgeGroups']) ? json_decode($_POST['childAgeGroups'], true) : [];

// Basic validation
if (!empty($product_name) && (strlen($product_name) < 3 || strlen($product_name) > 100)) {
    echo json_encode(["status" => "error", "message" => "Invalid product name"]);
    exit;
}

if (!empty($category) && !in_array($category, ['cultural-clothes', 'musical-instruments', 'handicraft-decors'])) {
    echo json_encode(["status" => "error", "message" => "Invalid category"]);
    exit;
}

// Validation for cultural-clothes
if (!empty($category) && $category === 'cultural-clothes') {
    if (!empty($audience) && !in_array($audience, ['men', 'women', 'boy', 'girl'])) {
        echo json_encode(["status" => "error", "message" => "Invalid audience"]);
        exit;
    }
}

if (!empty($description) && (strlen($description) < 10 || strlen($description) > 2000)) {
    echo json_encode(["status" => "error", "message" => "Invalid description"]);
    exit;
}

if (!empty($price) && (!is_numeric($price) || $price <= 0)) {
    echo json_encode(["status" => "error", "message" => "Invalid price"]);
    exit;
}

if (!empty($stock) && (!is_numeric($stock) || $stock < 0)) {
    echo json_encode(["status" => "error", "message" => "Invalid stock quantity"]);
    exit;
}

if (!empty($status) && !in_array($status, ['draft', 'published'])) {
    echo json_encode(["status" => "error", "message" => "Invalid status"]);
    exit;
}

// Start transaction
$conn->begin_transaction();

try {
    // Build dynamic update query for products table
    $updates = [];
    $params = [];
    $types = "";

    if (!empty($product_name) && $product_name !== $current_product['product_name']) {
        $updates[] = "product_name=?";
        $params[] = $product_name;
        $types .= "s";
    }

    if (!empty($product_type) && $product_type !== $current_product['product_type']) {
        $updates[] = "product_type=?";
        $params[] = $product_type;
        $types .= "s";
    }

    if (!empty($category) && $category !== $current_product['category']) {
        $updates[] = "category=?";
        $params[] = $category;
        $types .= "s";
    }

    // Update audience only for cultural-clothes
    if (!empty($category) && $category === 'cultural-clothes') {
        $audience_value = !empty($audience) ? $audience : null;
        if ($audience_value !== $current_product['audience']) {
            $updates[] = "audience=?";
            $params[] = $audience_value;
            $types .= "s";
        }
    }

    if (!empty($price) && $price != $current_product['price']) {
        $updates[] = "price=?";
        $params[] = floatval($price);
        $types .= "d";
    }

    if (isset($stock) && $stock !== '' && $stock != $current_product['stock']) {
        $updates[] = "stock=?";
        $params[] = intval($stock);
        $types .= "i";
    }

    if (!empty($description) && $description !== $current_product['description']) {
        $updates[] = "description=?";
        $params[] = $description;
        $types .= "s";
    }

    $material_value = !empty($material) ? $material : null;
    if ($material_value !== $current_product['material']) {
        $updates[] = "material=?";
        $params[] = $material_value;
        $types .= "s";
    }

    $dimensions_value = !empty($dimensions) ? $dimensions : null;
    if ($dimensions_value !== $current_product['dimensions']) {
        $updates[] = "dimensions=?";
        $params[] = $dimensions_value;
        $types .= "s";
    }

    $care_value = !empty($care_instructions) ? $care_instructions : null;
    if ($care_value !== $current_product['care_instructions']) {
        $updates[] = "care_instructions=?";
        $params[] = $care_value;
        $types .= "s";
    }

    if (!empty($status) && $status !== $current_product['status']) {
        $updates[] = "status=?";
        $params[] = $status;
        $types .= "s";
    }

    // Update product if there are changes
    if (!empty($updates)) {
        $query = "UPDATE products SET " . implode(", ", $updates) . " WHERE id=?";
        $params[] = $product_id;
        $types .= "i";

        $stmt = $conn->prepare($query);
        $stmt->bind_param($types, ...$params);

        if (!$stmt->execute()) {
            throw new Exception("Failed to update product");
        }
        $stmt->close();
    }

    // Update category-specific tables
    if (!empty($category)) {
        // If category has changed, clean up old category tables
        if ($category !== $current_product['category']) {
            // Delete from all category-specific tables
            $stmt = $conn->prepare("DELETE FROM product_clothes WHERE product_id = ?");
            $stmt->bind_param("i", $product_id);
            $stmt->execute();
            $stmt->close();

            $stmt = $conn->prepare("DELETE FROM product_instruments WHERE product_id = ?");
            $stmt->bind_param("i", $product_id);
            $stmt->execute();
            $stmt->close();

            $stmt = $conn->prepare("DELETE FROM product_arts WHERE product_id = ?");
            $stmt->bind_param("i", $product_id);
            $stmt->execute();
            $stmt->close();
        }

        // Insert into the appropriate category table
        if ($category === 'cultural-clothes') {
            // Delete existing records if category hasn't changed (for size/culture updates)
            if ($category === $current_product['category']) {
                $stmt = $conn->prepare("DELETE FROM product_clothes WHERE product_id = ?");
                $stmt->bind_param("i", $product_id);
                $stmt->execute();
                $stmt->close();
            }

            // Fetch all size_age_options
            $size_age_map = [];
            $result = $conn->query("SELECT id, gender, age_group, size_available FROM size_age_options");
            while ($row = $result->fetch_assoc()) {
                $key = strtolower($row['gender']) . '_';
                if (!empty($row['age_group'])) {
                    $key .= $row['age_group'];
                } elseif (!empty($row['size_available'])) {
                    $key .= $row['size_available'];
                }
                $size_age_map[$key] = $row['id'];
            }

            // Insert new records
            if (!empty($audience)) {
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
            }
        } elseif ($category === 'musical-instruments') {
            // Check if record already exists (if category hasn't changed)
            if ($category !== $current_product['category']) {
                $stmt = $conn->prepare("INSERT INTO product_instruments (product_id) VALUES (?)");
                $stmt->bind_param("i", $product_id);
                if (!$stmt->execute()) {
                    throw new Exception("Failed to insert instrument");
                }
                $stmt->close();
            }
        } elseif ($category === 'handicraft-decors') {
            // Check if record already exists (if category hasn't changed)
            if ($category !== $current_product['category']) {
                $stmt = $conn->prepare("INSERT INTO product_arts (product_id) VALUES (?)");
                $stmt->bind_param("i", $product_id);
                if (!$stmt->execute()) {
                    throw new Exception("Failed to insert art/decor");
                }
                $stmt->close();
            }
        }
    }



    // Update tags
    if (!empty($tags)) {
        // Delete existing tags
        $stmt = $conn->prepare("DELETE FROM product_tags WHERE product_id = ?");
        $stmt->bind_param("i", $product_id);
        $stmt->execute();
        $stmt->close();

        // Insert new tags
        $stmt = $conn->prepare("INSERT INTO product_tags (product_id, tag) VALUES (?, ?)");
        foreach ($tags as $tag) {
            $tag = trim($tag);
            if (!empty($tag) && strlen($tag) <= 50) {
                $stmt->bind_param("is", $product_id, $tag);
                $stmt->execute();
            }
        }
        $stmt->close();
    }

    // Handle new image uploads first to get their filenames
    $newUploadedFiles = [];
    if (isset($_FILES['newImages']) && is_array($_FILES['newImages']['name'])) {
        $allowedExts = ['jpg', 'jpeg', 'png', 'gif'];
        $maxFileSize = 5 * 1024 * 1024; // 5MB
        $fileCount = count($_FILES['newImages']['name']);

        for ($i = 0; $i < $fileCount; $i++) {
            if ($_FILES['newImages']['error'][$i] === 0) {
                $file_tmp = $_FILES['newImages']['tmp_name'][$i];
                $file_name = $_FILES['newImages']['name'][$i];
                $file_size = $_FILES['newImages']['size'][$i];

                if (!getimagesize($file_tmp)) continue;
                $fileExt = strtolower(pathinfo($file_name, PATHINFO_EXTENSION));
                if (!in_array($fileExt, $allowedExts) || $file_size > $maxFileSize) continue;

                $newFileName = 'product_' . $seller_id . '_' . time() . '_' . $i . '_' . bin2hex(random_bytes(8)) . '.' . $fileExt;
                $uploadPath = dirname(__DIR__) . '/uploads/product_images/' . $newFileName;

                if (move_uploaded_file($file_tmp, $uploadPath)) {
                    $newUploadedFiles[] = $newFileName;
                }
            }
        }
    }

    // Handle image deletions
    $deleted_images = json_decode($_POST['deletedImages'] ?? '[]', true);
    if (!empty($deleted_images)) {
        $uploadDir = dirname(__DIR__) . '/uploads/product_images/';
        foreach ($deleted_images as $img_url) {
            $stmt = $conn->prepare("SELECT id FROM product_images WHERE image_url = ? AND product_id = ?");
            $stmt->bind_param("si", $img_url, $product_id);
            $stmt->execute();
            $img = $stmt->get_result()->fetch_assoc();
            $stmt->close();

            if ($img) {
                $stmt = $conn->prepare("DELETE FROM product_images WHERE id = ?");
                $stmt->bind_param("i", $img['id']);
                $stmt->execute();
                $stmt->close();
                $filePath = $uploadDir . $img_url;
                if (file_exists($filePath)) unlink($filePath);
            }
        }
    }

    // Handle image reordering and inserting new ones in correct positions
    $image_order = json_decode($_POST['imageOrder'] ?? '[]', true);
    if (!empty($image_order)) {
        // Get all current images (after deletions)
        $stmt = $conn->prepare("SELECT id, image_url FROM product_images WHERE product_id = ?");
        $stmt->bind_param("i", $product_id);
        $stmt->execute();
        $result = $stmt->get_result();
        $current_db_images = [];
        while ($row = $result->fetch_assoc()) {
            $current_db_images[$row['image_url']] = $row['id'];
        }
        $stmt->close();

        $newFileIdx = 0;
        foreach ($image_order as $index => $identifier) {
            $order_position = $index + 1;

            if (isset($current_db_images[$identifier])) {
                // Existing image - update its order
                $stmt = $conn->prepare("UPDATE product_images SET `order` = ? WHERE id = ?");
                $stmt->bind_param("ii", $order_position, $current_db_images[$identifier]);
                $stmt->execute();
                $stmt->close();
            } elseif (strpos($identifier, 'new_') === 0 && isset($newUploadedFiles[$newFileIdx])) {
                // New image - insert it with correct order
                $newImgName = $newUploadedFiles[$newFileIdx];
                $stmt = $conn->prepare("INSERT INTO product_images (product_id, image_url, `order`) VALUES (?, ?, ?)");
                $stmt->bind_param("isi", $product_id, $newImgName, $order_position);
                $stmt->execute();
                $stmt->close();
                $newFileIdx++;
            }
        }

        // Safety: If there are new images that weren't in imageOrder for some reason, append them
        while ($newFileIdx < count($newUploadedFiles)) {
            $newImgName = $newUploadedFiles[$newFileIdx];
            $conn->query("INSERT INTO product_images (product_id, image_url, `order`) VALUES ($product_id, '$newImgName', 99)");
            $newFileIdx++;
        }
    }

    // Normalize image orders (ensure 1, 2, 3... sequence exists)
    $conn->query("SET @row_number = 0");
    $normStmt = $conn->prepare("
        UPDATE product_images 
        SET `order` = (@row_number:=@row_number + 1) 
        WHERE product_id = ? 
        ORDER BY `order` ASC, id ASC
    ");
    $normStmt->bind_param("i", $product_id);
    $normStmt->execute();
    $normStmt->close();

    // Commit transaction
    $conn->commit();

    echo json_encode([
        "status" => "success",
        "message" => $status === 'published' ? "Product published successfully" : "Draft saved successfully",
        "product_id" => $product_id
    ]);
} catch (Exception $e) {
    $conn->rollback();
    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
}

$conn->close();
exit;
