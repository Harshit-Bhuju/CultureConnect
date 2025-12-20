<?php
session_start();
include(__DIR__ . "/../header.php");

try {
    if (!isset($_SESSION['user_email'])) {
        echo json_encode(['success' => false, 'error' => 'User not authenticated']);
        exit;
    }

    $product_id = $_POST['productId'] ?? null;

    if (!$product_id) {
        echo json_encode(['success' => false, 'error' => 'Product ID is required']);
        exit;
    }

    $user_email = $_SESSION['user_email'];

    // Get user_id
    $stmt = $conn->prepare("SELECT id FROM users WHERE email = ? LIMIT 1");
    $stmt->bind_param("s", $user_email);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();
    $stmt->close();

    if (!$user) {
        echo json_encode(['success' => false, 'error' => 'User not found']);
        exit;
    }

    $user_id = $user['id'];

    // Check if product exists and is published
    $stmt = $conn->prepare("SELECT id, status FROM products WHERE id = ? LIMIT 1");
    $stmt->bind_param("i", $product_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $product = $result->fetch_assoc();
    $stmt->close();

    if (!$product) {
        echo json_encode(['success' => false, 'error' => 'Product not found']);
        exit;
    }

    if ($product['status'] !== 'published') {
        echo json_encode(['success' => false, 'error' => 'Product is not available']);
        exit;
    }

    // Check if already in wishlist
    $stmt = $conn->prepare("SELECT id FROM user_wishlist WHERE user_id = ? AND product_id = ? LIMIT 1");
    $stmt->bind_param("ii", $user_id, $product_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $existing = $result->fetch_assoc();
    $stmt->close();

    if ($existing) {
        echo json_encode(['success' => false, 'error' => 'Product already in wishlist']);
        exit;
    }

    // Add to wishlist
    $stmt = $conn->prepare("INSERT INTO user_wishlist (user_id, product_id) VALUES (?, ?)");
    $stmt->bind_param("ii", $user_id, $product_id);

    if (!$stmt->execute()) {
        throw new Exception('Failed to add to wishlist');
    }
    $stmt->close();

    echo json_encode([
        'success' => true,
        'message' => 'Added to wishlist successfully'
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}

$conn->close();
?>