<?php
session_start();
include(__DIR__ . "/../header.php");

try {
    if (!isset($_SESSION['user_email'])) {
        echo json_encode(['success' => false, 'error' => 'User not authenticated']);
        exit;
    }

    $cart_id = $_POST['cartId'] ?? null;

    if (!$cart_id) {
        echo json_encode(['success' => false, 'error' => 'Cart ID is required']);
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

    // Delete cart item
    $stmt = $conn->prepare("DELETE FROM user_cart WHERE id = ? AND user_id = ?");
    $stmt->bind_param("ii", $cart_id, $user_id);

    if (!$stmt->execute()) {
        throw new Exception('Failed to remove item from cart');
    }

    $affected_rows = $stmt->affected_rows;
    $stmt->close();

    if ($affected_rows === 0) {
        echo json_encode(['success' => false, 'error' => 'Cart item not found']);
        exit;
    }

    echo json_encode([
        'success' => true,
        'message' => 'Item removed from cart successfully'
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}

$conn->close();
