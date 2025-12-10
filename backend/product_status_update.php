<?php
session_start();
include("header.php");

try {
    if (!isset($_SESSION['user_email'])) {
        echo json_encode(["success" => false, "error" => "User not logged in"]);
        exit;
    }

    $user_email = $_SESSION['user_email'];
    $product_id = $_POST['product_id'] ?? null;
    $new_status = $_POST['status'] ?? null;

    if (!$product_id || !is_numeric($product_id)) {
        echo json_encode(["success" => false, "error" => "Invalid product ID"]);
        exit;
    }

    if (!$new_status || !in_array($new_status, ['published', 'draft', 'active'])) {
        echo json_encode(["success" => false, "error" => "Invalid status"]);
        exit;
    }

    // Normalize status (convert 'active' to 'published')
    if ($new_status === 'active') {
        $new_status = 'published';
    }

    // Get user's seller_id
    $stmt = $conn->prepare("
        SELECT u.id, s.id as seller_id 
        FROM users u 
        LEFT JOIN sellers s ON u.id = s.user_id 
        WHERE u.email = ? 
        LIMIT 1
    ");
    $stmt->bind_param("s", $user_email);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();
    $stmt->close();

    if (!$user || !$user['seller_id']) {
        echo json_encode(["success" => false, "error" => "No seller account found"]);
        exit;
    }

    $seller_id = $user['seller_id'];

    // Verify product belongs to seller
    $stmt = $conn->prepare("SELECT id FROM products WHERE id = ? AND seller_id = ? LIMIT 1");
    $stmt->bind_param("ii", $product_id, $seller_id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        echo json_encode(["success" => false, "error" => "Product not found or unauthorized"]);
        $stmt->close();
        exit;
    }
    $stmt->close();

    // Update product status
    $stmt = $conn->prepare("
        UPDATE products 
        SET status = ?, updated_at = NOW() 
        WHERE id = ? AND seller_id = ?
    ");
    $stmt->bind_param("sii", $new_status, $product_id, $seller_id);

    if ($stmt->execute()) {
        $display_status = $new_status === 'published' ? 'Active' : ucfirst($new_status);

        echo json_encode([
            "success" => true,
            "message" => "Product status updated successfully",
            "new_status" => $display_status
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "error" => "Failed to update product status"
        ]);
    }

    $stmt->close();
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}

$conn->close();
