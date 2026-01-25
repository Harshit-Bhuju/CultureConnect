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

    // Confirmation Link
    $confirm_link = "http://localhost:5173/confirm-delivery/" . $order_id;

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

    if (isset($data['demo_link'])) {
        // This logic is handled by sendResponseAndContinue in some setups, 
        // but here we just want to send the payload and EXIT the script execution if we want true async or just flush.
    }

    sendResponseAndContinue([
        "status" => "success",
        "message" => "Confirmation email sent. Please ask the customer to check their inbox."
    ]);

    // This code continues after the response is sent to the client
    sendEmail($email, $subject, $body);
} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}

$conn->close();
exit;
