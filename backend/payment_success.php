<?php
session_start();
include("dbconnect.php");

require_once __DIR__ . '/vendor/autoload.php';

use Xentixar\EsewaSdk\Esewa;

try {
    $esewa = new Esewa();
    $response = $esewa->decode();

    // 1. Decode must succeed
    if (!$response || ($response['status'] ?? '') !== 'COMPLETE') {
        header("Location: http://localhost:5173/?error=" . urlencode("Invalid payment response") . "&payment=failed");
        exit;
    }

    $transaction_uuid = $response['transaction_uuid'] ?? null;
    $paid_amount      = $response['total_amount'] ?? null;

    if (!$transaction_uuid || !$paid_amount) {
        header("Location: http://localhost:5173/?error=" . urlencode("Missing payment data") . "&payment=failed");
        exit;
    }

    // 2. Fetch transaction
    $stmt = $conn->prepare("
        SELECT pt.*, o.seller_id, o.product_id
        FROM payment_transactions pt
        JOIN orders o ON pt.order_id = o.id
        WHERE pt.transaction_uuid = ?
        LIMIT 1
    ");
    $stmt->bind_param("s", $transaction_uuid);
    $stmt->execute();
    $transaction = $stmt->get_result()->fetch_assoc();
    $stmt->close();

    if (!$transaction) {
        header("Location: http://localhost:5173/?error=" . urlencode("Transaction not found") . "&payment=failed");
        exit;
    }

    // 3. If already successful → just redirect (idempotent)
    if ($transaction['payment_status'] === 'success') {
        header("Location: http://localhost:5173/checkout/confirmation/{$transaction['seller_id']}/{$transaction['product_id']}?payment=success");
        exit;
    }

    // 4. Amount safety check
    if ((float)$paid_amount !== (float)$transaction['amount']) {
        header("Location: http://localhost:5173/products/{$transaction['seller_id']}/{$transaction['product_id']}?error=" . urlencode("Amount mismatch") . "&payment=failed");
        exit;
    }

    // 5. Atomic update
    $conn->begin_transaction();

    $stmt = $conn->prepare("
        UPDATE payment_transactions
        SET payment_status = 'success',
            payment_date = NOW(),
            updated_at = NOW()
        WHERE transaction_uuid = ?
          AND payment_status = 'pending'
    ");
    $stmt->bind_param("s", $transaction_uuid);
    $stmt->execute();
    $stmt->close();

    $stmt = $conn->prepare("
        UPDATE orders
        SET order_status = 'processing',
            updated_at = NOW()
        WHERE id = ?
    ");
    $stmt->bind_param("i", $transaction['order_id']);
    $stmt->execute();
    $stmt->close();

    $conn->commit();

    // 6. Success redirect
    header("Location: http://localhost:5173/checkout/confirmation/{$transaction['seller_id']}/{$transaction['product_id']}?payment=success");
    exit;
} catch (Exception $e) {
    $conn->rollback();


    header("Location: http://localhost:5173/?error=" . urlencode("Payment processing error") . "&payment=failed");
    exit;
}

$conn->close();
