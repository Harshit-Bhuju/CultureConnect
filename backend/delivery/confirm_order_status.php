<?php
require_once __DIR__ . '/../config/session_config.php';
include("../config/header.php");

// Authorization check: User must be logged in OR have a valid verification token
$user_email_session = $_SESSION['user_email'] ?? null;
$token = $_REQUEST['token'] ?? null;
$is_authorized = false;
$auth_method = null;
$user_email = null; // This will be set based on either token or session

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

        if (!$order_data) {
            echo json_encode(["status" => "error", "message" => "Order not found."]);
            exit;
        }

        // 1. Verify token FIRST (Prioritize token auth)
        if ($token) {
            $salt = "CultureConnect_Secret_2024";
            $expected_token = hash_hmac('sha256', $order_id . $order_data['email'], $salt);
            if ($token === $expected_token) {
                $is_authorized = true;
                $auth_method = 'token';
                $user_email = $order_data['email'];
            }
        }

        // 2. Fallback to session if no token or token invalid
        if (!$is_authorized && $user_email_session) {
            $is_authorized = true;
            $auth_method = 'session';
            $user_email = $user_email_session;
        }

        if (!$is_authorized) {
            echo json_encode(["status" => "unauthorized", "message" => "Please log in or use a valid confirmation link."]);
            exit;
        }

        if ($order_data['email'] !== $user_email) {
            echo json_encode(["status" => "error", "message" => "You are not authorized to confirm this order."]);
            exit;
        }

        // Check for expiry (Already completed or already reported)
        if ($order_data['order_status'] === 'completed') {
            echo json_encode(["status" => "already_done", "message" => "This order has already been confirmed as delivered."]);
            exit;
        }

        $report_check = $conn->prepare("SELECT order_id FROM delivery_reports WHERE order_id = ?");
        $report_check->bind_param("i", $order_id);
        $report_check->execute();
        $report_check_res = $report_check->get_result();
        if ($report_check_res->num_rows > 0) {
            echo json_encode(["status" => "already_reported", "message" => "You have already reported an issue with this delivery."]);
            exit;
        }
        $report_check->close();

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
            // 1. Verify token FIRST (Prioritize token auth)
            if ($token) {
                $salt = "CultureConnect_Secret_2024";
                $expected_token = hash_hmac('sha256', $order_id . $order['email'], $salt);
                if ($token === $expected_token) {
                    $is_authorized = true;
                    $auth_method = 'token';
                    $user_email = $order['email'];
                }
            }

            // 2. Fallback to session if no token or token invalid
            if (!$is_authorized && $user_email_session) {
                $is_authorized = true;
                $auth_method = 'session';
                $user_email = $user_email_session;
            }

            if (!$is_authorized) {
                echo json_encode(["status" => "unauthorized", "message" => "Please log in to confirm your delivery."]);
                exit;
            }

            if ($order['email'] !== $user_email) {
                echo json_encode([
                    "status" => "unauthorized",
                    "message" => "You are currently logged in as <strong>$user_email</strong>, but this confirmation link belongs to another user."
                ]);
                exit;
            }

            // Check for expiry (Already completed or already reported)
            if ($order['order_status'] === 'completed') {
                echo json_encode(["status" => "already_done", "message" => "This order has already been confirmed as delivered."]);
                exit;
            }

            $report_check = $conn->prepare("SELECT order_id FROM delivery_reports WHERE order_id = ?");
            $report_check->bind_param("i", $order_id);
            $report_check->execute();
            $report_check_res = $report_check->get_result();
            if ($report_check_res->num_rows > 0) {
                echo json_encode(["status" => "already_reported", "message" => "You have already reported an issue with this delivery."]);
                exit;
            }
            $report_check->close();

            echo json_encode([
                "status" => "success",
                "product_name" => $order['product_name'],
                "order_status" => $order['order_status'],
                "auth_method" => $auth_method
            ]);
        } else {
            echo json_encode(["status" => "error", "message" => "Order not found."]);
        }
    } catch (Exception $e) {
        echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    }
}

$conn->close();
exit;
