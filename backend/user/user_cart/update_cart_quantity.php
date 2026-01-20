<?php
require_once __DIR__ . '/../../config/session_config.php';
include(__DIR__ . "/../../config/header.php");

try {
    if (!isset($_SESSION['user_email'])) {
        echo json_encode(['success' => false, 'error' => 'User not authenticated']);
        exit;
    }

    $cart_id = $_POST['cartId'] ?? null;
    $change = $_POST['change'] ?? null;

    if (!$cart_id) {
        echo json_encode(['success' => false, 'error' => 'Cart ID is required']);
        exit;
    }

    if ($change === null || !in_array($change, ['-1', '1', -1, 1])) {
        echo json_encode(['success' => false, 'error' => 'Invalid change value']);
        exit;
    }

    $change = intval($change);
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

    // Get current cart item
    $stmt = $conn->prepare("SELECT c.id, c.quantity, c.product_id, p.stock 
                            FROM user_cart c 
                            JOIN products p ON c.product_id = p.id 
                            WHERE c.id = ? AND c.user_id = ? 
                            LIMIT 1");
    $stmt->bind_param("ii", $cart_id, $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $cart_item = $result->fetch_assoc();
    $stmt->close();

    if (!$cart_item) {
        echo json_encode(['success' => false, 'error' => 'Cart item not found']);
        exit;
    }

    $new_quantity = $cart_item['quantity'] + $change;

    if ($new_quantity < 1) {
        echo json_encode(['success' => false, 'error' => 'Quantity cannot be less than 1']);
        exit;
    }

    if ($new_quantity > $cart_item['stock']) {
        echo json_encode(['success' => false, 'error' => 'Not enough stock available']);
        exit;
    }

    // Update quantity
    $stmt = $conn->prepare("UPDATE user_cart SET quantity = ?, updated_at = NOW() WHERE id = ?");
    $stmt->bind_param("ii", $new_quantity, $cart_id);

    if (!$stmt->execute()) {
        throw new Exception('Failed to update cart quantity');
    }
    $stmt->close();

    echo json_encode([
        'success' => true,
        'message' => 'Quantity updated successfully',
        'newQuantity' => $new_quantity
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}

$conn->close();
