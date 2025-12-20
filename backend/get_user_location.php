<?php
session_start();
include("header.php");

try {
    $user_email = $_SESSION['user_email'];

    if (!$user_email) {
        echo json_encode(["success" => false, "error" => "User not authenticated"]);
        exit;
    }

    // Get product_id and quantity from request
    $product_id = $_GET['product_id'] ?? null;
    $quantity = $_GET['quantity'] ?? 1;

    if (!$product_id) {
        echo json_encode(["success" => false, "error" => "Product ID is required"]);
        exit;
    }

    // Get user's location
    $stmt = $conn->prepare("
        SELECT 
            province,
            district,
            municipality,
            ward
        FROM users 
        WHERE email = ? 
        LIMIT 1
    ");
    $stmt->bind_param("s", $user_email);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();
    $stmt->close();

    if (!$user) {
        echo json_encode(["success" => false, "error" => "User not found"]);
        exit;
    }

    // Get product details including image and seller logo
    $stmt = $conn->prepare("
        SELECT 
            p.id,
            p.product_name,
            p.price,
            p.stock,
            p.seller_id,
            pi.image_url as product_image,
            s.store_name,
            s.store_logo
        FROM products p
        LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.`order` = 1
        LEFT JOIN sellers s ON p.seller_id = s.id
        WHERE p.id = ? AND p.status = 'published'
        LIMIT 1
    ");
    $stmt->bind_param("i", $product_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $product = $result->fetch_assoc();
    $stmt->close();

    if (!$product) {
        echo json_encode(["success" => false, "error" => "Product not found or not available"]);
        exit;
    }

    // Validate stock
    if ($product['stock'] < $quantity) {
        echo json_encode([
            "success" => false,
            "error" => "Insufficient stock. Available: " . $product['stock'],
            "availableStock" => (int)$product['stock']
        ]);
        exit;
    }

    // Check if user has complete location info
    $hasLocation = !empty($user['province']) && !empty($user['district']) &&
        !empty($user['municipality']) && !empty($user['ward']);

    $location = null;
    if ($hasLocation) {
        $location = [
            "name" => "{$user['province']}, {$user['district']}, {$user['municipality']}, {$user['ward']}",
            "province" => $user['province'],
            "district" => $user['district'],
            "municipality" => $user['municipality'],
            "ward" => $user['ward']
        ];
    }

    echo json_encode([
        "success" => true,
        "hasLocation" => $hasLocation,
        "location" => $location,
        "product" => [
            "id" => (int)$product['id'],
            "name" => $product['product_name'],
            "price" => (float)$product['price'],
            "stock" => (int)$product['stock'],
            "product_image" => $product['product_image'],
            "store_name" => $product['store_name'],
            "store_logo" => $product['store_logo']
        ]
    ]);
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}

$conn->close();
