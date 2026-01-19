<?php
require_once __DIR__ . '/../config/session_config.php';
include("../config/header.php");

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

if (!$user || !$user['seller_id']) {
    echo json_encode(["status" => "error", "message" => "No seller account found"]);
    exit;
}

$seller_id = $user['seller_id'];

// Get product ID
$product_id = $_POST['product_id'] ?? null;

if (!$product_id || !is_numeric($product_id)) {
    echo json_encode(["status" => "error", "message" => "Invalid product ID"]);
    exit;
}

// Verify product belongs to seller
$stmt = $conn->prepare("SELECT id FROM products WHERE id = ? AND seller_id = ? LIMIT 1");
$stmt->bind_param("ii", $product_id, $seller_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(["status" => "error", "message" => "Product not found or unauthorized"]);
    $stmt->close();
    $conn->close();
    exit;
}
$stmt->close();

// Get product images before deletion
$stmt = $conn->prepare("SELECT image_url FROM product_images WHERE product_id = ?");
$stmt->bind_param("i", $product_id);
$stmt->execute();
$result = $stmt->get_result();
$images = [];
while ($row = $result->fetch_assoc()) {
    $images[] = $row['image_url'];
}
$stmt->close();

// Soft delete by updating status to 'deleted'
// The trigger will cascade delete related data
$stmt = $conn->prepare("UPDATE products SET status = 'deleted' WHERE id = ?");
$stmt->bind_param("i", $product_id);

if ($stmt->execute()) {
    // Delete physical image files
    $uploadDir = __DIR__ . '/product_images/';
    foreach ($images as $imageName) {
        $filePath = $uploadDir . $imageName;
        if (file_exists($filePath)) {
            unlink($filePath);
        }
    }
    
    echo json_encode([
        "status" => "success",
        "message" => "Product deleted successfully"
    ]);
} else {
    echo json_encode([
        "status" => "error",
        "message" => "Failed to delete product"
    ]);
}

$stmt->close();
$conn->close();
exit;
?>
