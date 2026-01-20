<?php
require_once __DIR__ . '/../../config/session_config.php';
include(__DIR__ . "/../../config/header.php");

try {
    if (!isset($_SESSION['user_email'])) {
        echo json_encode(['success' => false, 'error' => 'User not authenticated']);
        exit;
    }

    $product_id = $_POST['productId'] ?? null;
    $quantity = $_POST['quantity'] ?? 1;

    if (!$product_id) {
        echo json_encode(['success' => false, 'error' => 'Product ID is required']);
        exit;
    }

    if ($quantity < 1) {
        echo json_encode(['success' => false, 'error' => 'Quantity must be at least 1']);
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

    // Check if product exists, is published, and has stock
    $stmt = $conn->prepare("SELECT id, stock, status FROM products WHERE id = ? LIMIT 1");
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

    if ($product['stock'] < $quantity) {
        echo json_encode(['success' => false, 'error' => 'Not enough stock available']);
        exit;
    }

    // Check if already in cart
    $stmt = $conn->prepare("SELECT id, quantity FROM user_cart WHERE user_id = ? AND product_id = ? LIMIT 1");
    $stmt->bind_param("ii", $user_id, $product_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $existing = $result->fetch_assoc();
    $stmt->close();

    if ($existing) {
        // Update existing cart item
        $new_quantity = $existing['quantity'] + $quantity;

        if ($new_quantity > $product['stock']) {
            echo json_encode(['success' => false, 'error' => 'Not enough stock available']);
            exit;
        }

        $stmt = $conn->prepare("UPDATE user_cart SET quantity = ?, updated_at = NOW() WHERE id = ?");
        $stmt->bind_param("ii", $new_quantity, $existing['id']);

        if (!$stmt->execute()) {
            throw new Exception('Failed to update cart');
        }
        $stmt->close();

        echo json_encode([
            'success' => true,
            'message' => 'Cart updated successfully',
            'updated' => true
        ]);
    } else {
        // Add new cart item
        $stmt = $conn->prepare("INSERT INTO user_cart (user_id, product_id, quantity) VALUES (?, ?, ?)");
        $stmt->bind_param("iii", $user_id, $product_id, $quantity);

        if (!$stmt->execute()) {
            throw new Exception('Failed to add to cart');
        }
        $stmt->close();

        echo json_encode([
            'success' => true,
            'message' => 'Added to cart successfully',
            'updated' => false
        ]);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}

$conn->close();
