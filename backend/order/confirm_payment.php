<?php
require_once __DIR__ . '/../config/session_config.php';
include("../config/header.php");

require_once __DIR__ . '../../vendor/autoload.php';

use Xentixar\EsewaSdk\Esewa;


try {
    $user_email = $_SESSION['user_email'];

    if (!$user_email) {
        echo json_encode(["success" => false, "error" => "User not authenticated"]);
        exit;
    }

    $order_id = $_POST['order_id'] ?? null;
    $payment_method = $_POST['payment_method'] ?? 'cod';

    if (!$order_id) {
        echo json_encode(["success" => false, "error" => "Order ID is required"]);
        exit;
    }

    // Capture and sessionize the frontend URL for subsequent redirects
    if (isset($_POST['frontend_url'])) {
        $_SESSION['frontend_url'] = $_POST['frontend_url'];
    }

    $stmt = $conn->prepare("SELECT id FROM users WHERE email = ? LIMIT 1");
    $stmt->bind_param("s", $user_email);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();
    $stmt->close();

    if (!$user) {
        echo json_encode(["success" => false, "error" => "User not found"]);
        exit;
    }

    $user_id = $user['id'];

    $stmt = $conn->prepare("
        SELECT 
            o.*,
            p.stock
        FROM orders o
        JOIN products p ON o.product_id = p.id
        WHERE o.id = ? 
        AND o.user_id = ? 
        AND o.order_status = 'no_payment'
        LIMIT 1
    ");
    $stmt->bind_param("ii", $order_id, $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $order = $result->fetch_assoc();
    $stmt->close();

    if (!$order) {
        echo json_encode(["success" => false, "error" => "Order not found or already processed"]);
        exit;
    }

    if ($order['stock'] < $order['quantity']) {
        echo json_encode([
            "success" => false,
            "error" => "Insufficient stock. Available: " . $order['stock'],
            "availableStock" => (int)$order['stock']
        ]);
        exit;
    }

    $conn->begin_transaction();

    try {
        $payment_status = 'pending';

        $stmt = $conn->prepare("
            INSERT INTO payment_transactions (
                order_id,
                payment_method,
                payment_status,
                amount
            ) VALUES (?, ?, ?, ?)
        ");

        $stmt->bind_param(
            "issd",
            $order_id,
            $payment_method,
            $payment_status,
            $order['total_amount']
        );

        $stmt->execute();
        $transaction_id = $conn->insert_id;
        $stmt->close();

        if ($payment_method === 'esewa') {
            $transaction_uuid = "TRAN_" . $order['order_number'] . '-' . $transaction_id;

            $stmt = $conn->prepare("
                UPDATE payment_transactions 
                SET transaction_uuid = ?
                WHERE id = ?
            ");
            $stmt->bind_param("si", $transaction_uuid, $transaction_id);
            $stmt->execute();
            $stmt->close();

            $conn->commit();

            // CRITICAL: Pass subtotal and delivery separately
            $subtotal = $order['subtotal'];
            $delivery_charge = $order['delivery_charge'];

            $esewa = new Esewa();

            // Dynamically build the backend base URL for callbacks
            $protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http";
            $host = $_SERVER['HTTP_HOST'];
            $base_url = "{$protocol}://{$host}/CultureConnect/backend/order";

            $success_url = $base_url . "/payment_success.php";
            $failure_url = $base_url . "/payment_failure.php?seller_id=" . $order['seller_id'] . "&product_id=" . $order['product_id'] . "&transaction_uuid=" . urlencode($transaction_uuid);

            $esewa->config(
                $success_url,
                $failure_url,
                (float)$subtotal,
                $transaction_uuid,
                'EPAYTEST',
                '8gBm/:&EnhH.1/q',
                0.00,
                0.00,
                (float)$delivery_charge
            );

            // Set header BEFORE init() outputs the form
            header("Content-Type: text/html; charset=UTF-8");
            $esewa->init(false);  // This echoes the form directly
            exit;
        }

        // COD Payment
        $stmt = $conn->prepare("
            UPDATE orders 
            SET order_status = 'processing',
                updated_at = NOW()
            WHERE id = ?
        ");
        $stmt->bind_param("i", $order_id);
        $stmt->execute();
        $stmt->close();

        $stmt = $conn->prepare("
            UPDATE payment_transactions 
            SET payment_status = 'pending',
                payment_date = NOW(),
                updated_at = NOW()
            WHERE id = ?
        ");
        $stmt->bind_param("i", $transaction_id);
        $stmt->execute();
        $stmt->close();

        // New Task: Remove from cart after successful order
        $stmt = $conn->prepare("DELETE FROM user_cart WHERE user_id = ? AND product_id = ?");
        $stmt->bind_param("ii", $user_id, $order['product_id']);
        $stmt->execute();
        $stmt->close();

        $conn->commit();

        echo json_encode([
            "success" => true,
            "redirect_to_esewa" => false,
            "transaction_id" => $transaction_id,
            "payment_method" => $payment_method
        ]);
    } catch (Exception $e) {
        $conn->rollback();
        throw $e;
    }
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}

$conn->close();
