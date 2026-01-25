<?php
require_once __DIR__ . '/../config/session_config.php';
include("../config/header.php");

// Only allow logged in users (customers) to confirm their own orders
if (!isset($_SESSION['logged_in']) || $_SESSION['logged_in'] !== true) {
    echo json_encode(["status" => "unauthorized", "message" => "Please log in to confirm your delivery."]);
    exit;
}

$user_email = $_SESSION['user_email'];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $order_id = isset($_POST['order_id']) ? intval($_POST['order_id']) : null;
    $action = isset($_POST['action']) ? $_POST['action'] : 'confirm'; // 'confirm' or 'report'

    if (!$order_id) {
        echo json_encode(["status" => "error", "message" => "Order ID required."]);
        exit;
    }

    try {
        // Security check: Match session email with order user email
        $check_stmt = $conn->prepare("
            SELECT u.email, o.order_status 
            FROM orders o 
            JOIN users u ON o.user_id = u.id 
            WHERE o.id = ?
        ");
        $check_stmt->bind_param("i", $order_id);
        $check_stmt->execute();
        $order_result = $check_stmt->get_result();
        $order_data = $order_result->fetch_assoc();
        $check_stmt->close();

        if (!$order_data || $order_data['email'] !== $user_email) {
            echo json_encode(["status" => "error", "message" => "You are not authorized to confirm this order."]);
            exit;
        }

        if ($order_data['order_status'] === 'completed') {
            echo json_encode(["status" => "already_done", "message" => "This order has already been confirmed as delivered."]);
            exit;
        }

        if ($action === 'report') {
            // User says "No"
            $report_stmt = $conn->prepare("INSERT INTO delivery_reports (order_id) VALUES (?)");
            $report_stmt->bind_param("i", $order_id);
            $report_stmt->execute();
            $report_stmt->close();

            echo json_encode(["status" => "reported", "message" => "Report received. It might be a mistake from our side, please patiently wait for your orders."]);
        } else {
            // User says "Yes"
            $stmt = $conn->prepare("UPDATE orders SET order_status = 'completed' WHERE id = ?");
            $stmt->bind_param("i", $order_id);

            if ($stmt->execute()) {
                echo json_encode(["status" => "success", "message" => "Order marked as completed."]);
            } else {
                echo json_encode(["status" => "error", "message" => "Failed to update order status."]);
            }
            $stmt->close();
        }
    } catch (Exception $e) {
        echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    }
} else {
    // GET request to fetch product name...
    $order_id = isset($_GET['order_id']) ? intval($_GET['order_id']) : null;

    if (!$order_id) {
        echo json_encode(["status" => "error", "message" => "Order ID required."]);
        exit;
    }

    try {
        // Fetch product and verify email
        $stmt = $conn->prepare("
            SELECT p.product_name, u.email, o.order_status
            FROM orders o 
            JOIN products p ON o.product_id = p.id 
            JOIN users u ON o.user_id = u.id
            WHERE o.id = ?
        ");
        $stmt->bind_param("i", $order_id);
        $stmt->execute();
        $result = $stmt->get_result();
        $order = $result->fetch_assoc();
        $stmt->close();

        if ($order) {
            if ($order['email'] !== $user_email) {
                echo json_encode(["status" => "unauthorized", "message" => "This confirmation link belongs to another user."]);
            } else {
                echo json_encode([
                    "status" => "success",
                    "product_name" => $order['product_name'],
                    "order_status" => $order['order_status']
                ]);
            }
        } else {
            echo json_encode(["status" => "error", "message" => "Order not found."]);
        }
    } catch (Exception $e) {
        echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    }
}

$conn->close();
exit;
