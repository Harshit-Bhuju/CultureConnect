<?php
require_once __DIR__ . '/../../config/session_config.php';
include(__DIR__ . "/../../config/header.php");

try {
    if (!isset($_SESSION['user_email'])) {
        echo json_encode(['success' => false, 'error' => 'User not authenticated']);
        exit;
    }

    $order_id = $_POST['orderId'] ?? null;
    $reason = $_POST['reason'] ?? null;
    $description = $_POST['description'] ?? null;

    if (!$order_id) {
        echo json_encode(['success' => false, 'error' => 'Order ID is required']);
        exit;
    }

    if (!$reason) {
        echo json_encode(['success' => false, 'error' => 'Cancellation reason is required']);
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

    // Get order details with payment info
    $stmt = $conn->prepare("
        SELECT 
            o.id,
            o.order_status,
            o.product_id,
            o.quantity,
            pt.payment_method,
            pt.payment_status,
            pt.id as transaction_id
        FROM orders o
        LEFT JOIN payment_transactions pt ON o.id = pt.order_id
        WHERE o.id = ? AND o.user_id = ?
        LIMIT 1
    ");
    $stmt->bind_param("ii", $order_id, $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $order = $result->fetch_assoc();
    $stmt->close();

    if (!$order) {
        echo json_encode(['success' => false, 'error' => 'Order not found']);
        exit;
    }

    // Check if order can be cancelled (only processing orders)
    if ($order['order_status'] !== 'processing') {
        echo json_encode([
            'success' => false,
            'error' => 'Only processing orders can be cancelled'
        ]);
        exit;
    }

    // Check if already cancelled
    $stmt = $conn->prepare("SELECT id FROM order_cancellation WHERE order_id = ? LIMIT 1");
    $stmt->bind_param("i", $order_id);
    $stmt->execute();
    $existing = $stmt->get_result()->fetch_assoc();
    $stmt->close();

    if ($existing) {
        echo json_encode(['success' => false, 'error' => 'Order is already cancelled']);
        exit;
    }

    // Start transaction
    $conn->begin_transaction();

    try {
        // 1. Insert cancellation record
        $cancelled_by = 'user';
        $stmt = $conn->prepare("
            INSERT INTO order_cancellation (order_id, user_id, reason, description, cancelled_by)
            VALUES (?, ?, ?, ?, ?)
        ");
        $stmt->bind_param("iisss", $order_id, $user_id, $reason, $description, $cancelled_by);

        if (!$stmt->execute()) {
            throw new Exception('Failed to record cancellation');
        }
        $stmt->close();

        // 2. Update order status to cancelled
        $stmt = $conn->prepare("
            UPDATE orders 
            SET order_status = 'cancelled',
                updated_at = NOW()
            WHERE id = ? AND user_id = ?
        ");
        $stmt->bind_param("ii", $order_id, $user_id);

        if (!$stmt->execute()) {
            throw new Exception('Failed to update order status');
        }
        $stmt->close();

        // 3. Restore product stock
        $stmt = $conn->prepare("
            UPDATE products 
            SET stock = stock + ?
            WHERE id = ?
        ");
        $stmt->bind_param("ii", $order['quantity'], $order['product_id']);

        if (!$stmt->execute()) {
            throw new Exception('Failed to restore product stock');
        }
        $stmt->close();

        // 4. Update payment status
        if ($order['payment_method'] !== 'cod' && $order['payment_status'] === 'success') {
            // eSewa/Khalti: Set to pending_refund
            $stmt = $conn->prepare("
                UPDATE payment_transactions 
                SET payment_status = 'pending_refund',
                    updated_at = NOW()
                WHERE id = ?
            ");
            $stmt->bind_param("i", $order['transaction_id']);

            if (!$stmt->execute()) {
                throw new Exception('Failed to update payment status');
            }
            $stmt->close();

            $refund_message = 'Order cancelled. Refund will be processed within 3-7 business days';
        } elseif ($order['payment_method'] === 'cod') {
            // COD: Set to no_payment
            $stmt = $conn->prepare("
                UPDATE payment_transactions 
                SET payment_status = 'no_payment',
                    updated_at = NOW()
                WHERE id = ?
            ");
            $stmt->bind_param("i", $order['transaction_id']);

            if (!$stmt->execute()) {
                throw new Exception('Failed to update payment status');
            }
            $stmt->close();

            $refund_message = 'Order cancelled successfully';
        } else {
            $refund_message = 'Order cancelled successfully';
        }

        // Commit transaction
        $conn->commit();

        echo json_encode([
            'success' => true,
            'message' => $refund_message,
        ]);
    } catch (Exception $e) {
        $conn->rollback();
        throw $e;
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}

$conn->close();
