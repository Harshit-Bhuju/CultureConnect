<?php
session_start();
include("header.php");

try {
    // Check authentication
    if (!isset($_SESSION['user_email'])) {
        echo json_encode(["success" => false, "error" => "Not authenticated"]);
        exit;
    }

    $user_email = $_SESSION['user_email'];

    // Get user and seller ID
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

    if (!$user) {
        echo json_encode(["success" => false, "error" => "User not found"]);
        exit;
    }

    if (!$user['seller_id']) {
        echo json_encode(["success" => false, "error" => "Only sellers can delete replies"]);
        exit;
    }

    $seller_id = $user['seller_id'];

    // Get POST data
    $reply_id = $_POST['reply_id'] ?? null;

    // Validation
    if (!$reply_id || !is_numeric($reply_id)) {
        echo json_encode(["success" => false, "error" => "Invalid reply ID"]);
        exit;
    }

    // Verify the reply exists and belongs to this seller
    $stmt = $conn->prepare("
        SELECT id, review_id 
        FROM seller_review_replies 
        WHERE id = ? AND seller_id = ? 
        LIMIT 1
    ");
    $stmt->bind_param("ii", $reply_id, $seller_id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        echo json_encode(["success" => false, "error" => "Reply not found or unauthorized"]);
        exit;
    }

    $reply = $result->fetch_assoc();
    $review_id = $reply['review_id'];
    $stmt->close();

    // Delete the reply
    $stmt = $conn->prepare("DELETE FROM seller_review_replies WHERE id = ? AND seller_id = ?");
    $stmt->bind_param("ii", $reply_id, $seller_id);

    if ($stmt->execute()) {
        $stmt->close();

        echo json_encode([
            "success" => true,
            
            "review_id" => $review_id
        ]);
    } else {
        echo json_encode(["success" => false, "error" => "Failed to delete reply"]);
    }
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}

$conn->close();