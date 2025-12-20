<?php
session_start();
include("dbconnect.php");

try {
    $transaction_uuid = $_GET['transaction_uuid'] ?? null;
    $seller_id = $_GET['seller_id'] ?? null;
    $product_id = $_GET['product_id'] ?? null;

    if ($transaction_uuid) {
        $stmt = $conn->prepare("
            SELECT pt.*, o.seller_id, o.product_id
            FROM payment_transactions pt
            JOIN orders o ON pt.order_id = o.id
            WHERE pt.transaction_uuid = ?
            LIMIT 1
        ");
        $stmt->bind_param("s", $transaction_uuid);
        $stmt->execute();
        $result = $stmt->get_result();
        $transaction = $result->fetch_assoc();
        $stmt->close();

        if ($transaction) {
            $stmt = $conn->prepare("
                UPDATE payment_transactions 
                SET payment_status = 'failed',
                    updated_at = NOW()
                WHERE transaction_uuid = ?
            ");
            $stmt->bind_param("s", $transaction_uuid);
            $stmt->execute();
            $stmt->close();

            $stmt = $conn->prepare("
                UPDATE orders 
                SET order_status = 'cancelled',
                    updated_at = NOW()
                WHERE id = ?
            ");
            $stmt->bind_param("i", $transaction['order_id']);
            $stmt->execute();
            $stmt->close();

            $redirect_seller_id = $seller_id ?? $transaction['seller_id'];
            $redirect_product_id = $product_id ?? $transaction['product_id'];

            header("Location: http://localhost:5173/products/{$redirect_seller_id}/{$redirect_product_id}?error=" . urlencode("Payment failed or cancelled. Please try again.") . "&payment=failed");
            exit;
        }
    }

    if ($seller_id && $product_id) {
        header("Location: http://localhost:5173/products/{$seller_id}/{$product_id}?error=" . urlencode("Payment was cancelled. Please try again.") . "&payment=failed");
        exit;
    }

    header("Location: http://localhost:5173/?error=" . urlencode("Payment failed. Please try again.") . "&payment=failed");
    exit;
} catch (Exception $e) {
    if (isset($_GET['seller_id']) && isset($_GET['product_id'])) {
        header("Location: http://localhost:5173/products/{$_GET['seller_id']}/{$_GET['product_id']}?error=" . urlencode("Payment error occurred") . "&payment=failed");
    } else {
        header("Location: http://localhost:5173/?error=" . urlencode("Payment error") . "&payment=failed");
    }
    exit;
}

$conn->close();