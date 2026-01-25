<?php
require_once __DIR__ . '/../config/session_config.php';
include("../config/header.php");
require_once __DIR__ . '/../config/mail.php';

if (!isset($_SESSION['logged_in']) || $_SESSION['logged_in'] !== true) {
    echo json_encode(["status" => "error", "message" => "Unauthorized access."]);
    exit;
}

$order_id = isset($_POST['order_id']) ? intval($_POST['order_id']) : null;

if (!$order_id) {
    echo json_encode(["status" => "error", "message" => "Order ID required."]);
    exit;
}

try {
    // Fetch user email and product name
    $stmt = $conn->prepare("
        SELECT u.email, p.product_name, o.order_number
        FROM orders o
        JOIN users u ON o.user_id = u.id
        JOIN products p ON o.product_id = p.id
        WHERE o.id = ?
    ");
    $stmt->bind_param("i", $order_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $order = $result->fetch_assoc();
    $stmt->close();

    if (!$order) {
        echo json_encode(["status" => "error", "message" => "Order not found."]);
        exit;
    }

    $email = $order['email'];
    $product_name = $order['product_name'];
    $order_number = $order['order_number'];

    // Generate a secure token (deterministic for now based on order_id and a secret)
    // In a real app, this might be a random string stored in DB, but this works without schema changes.
    $salt = "CultureConnect_Secret_2026";
    $token = hash_hmac('sha256', $order_id . $email, $salt);

    // Hardcoded frontend URL as requested
    $frontend_url = "https://harmanbhuju.com.np";

    // Confirmation Link with token
    $confirm_link = "{$frontend_url}/confirm-delivery/{$order_id}?token={$token}";

    $subject = "Delivery Confirmation: " . $product_name;
    $body = "
    <html>
    <head>
        <style>
            .container { font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; }
            .button { 
                display: inline-block; 
                padding: 10px 20px; 
                background-color: #2563EB; 
                color: #ffffff; 
                text-decoration: none; 
                border-radius: 5px; 
                font-weight: bold;
                margin-top: 20px;
            }
        </style>
    </head>
    <body class='container'>
        <h2>Hello!</h2>
        <p>Your order <strong>{$order_number}</strong> ({$product_name}) has been delivered successfully by our delivery boy.</p>
        <p>Please confirm that you have received the product by clicking the button below:</p>
        <a href='{$confirm_link}' class='button' style='color: white;'>Confirm Receipt</a>
        <p>If you have any issues, please contact our support.</p>
        <p>Thanks,<br>Team CultureConnect</p>
    </body>
    </html>";

    // Send success response to client

    // Update order status to 'delivered_pending' BEFORE response
    $status_stmt = $conn->prepare("UPDATE orders SET order_status = 'delivered_pending' WHERE id = ?");
    $status_stmt->bind_param("i", $order_id);
    $status_stmt->execute();
    $status_stmt->close();

    sendResponseAndContinue([
        "status" => "success",
        "message" => "Confirmation email sent. Please ask the customer to check their inbox.",
        "order_id" => $order_id
    ]);

    // This code continues after the response is sent to the client
    sendEmail($email, $subject, $body);
} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}

$conn->close();
exit;
