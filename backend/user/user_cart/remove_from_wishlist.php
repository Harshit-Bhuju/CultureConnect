<?php
require_once __DIR__ . '/../../config/session_config.php';
include(__DIR__ . "/../../config/header.php");

try {
    if (!isset($_SESSION['user_email'])) {
        echo json_encode(['success' => false, 'error' => 'User not authenticated']);
        exit;
    }

    $product_id = $_POST['productId'] ?? null;
    $wishlist_id = $_POST['wishlistId'] ?? null;

    if (!$product_id && !$wishlist_id) {
        echo json_encode(['success' => false, 'error' => 'Product ID or Wishlist ID is required']);
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

    // Delete from wishlist
    if ($product_id) {
        $stmt = $conn->prepare("DELETE FROM user_wishlist WHERE product_id = ? AND user_id = ?");
        $stmt->bind_param("ii", $product_id, $user_id);
    } else {
        $stmt = $conn->prepare("DELETE FROM user_wishlist WHERE id = ? AND user_id = ?");
        $stmt->bind_param("ii", $wishlist_id, $user_id);
    }

    if (!$stmt->execute()) {
        throw new Exception('Failed to remove from wishlist');
    }

    $affected_rows = $stmt->affected_rows;
    $stmt->close();

    if ($affected_rows === 0) {
        echo json_encode(['success' => false, 'error' => 'Wishlist item not found']);
        exit;
    }

    echo json_encode([
        'success' => true,
        'message' => 'Removed from wishlist successfully'
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}

$conn->close();
