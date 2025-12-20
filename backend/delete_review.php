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

    // Get user ID
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

    // Get POST data
    $review_id = $_POST['review_id'] ?? null;

    // Validation
    if (!$review_id || !is_numeric($review_id)) {
        echo json_encode(["success" => false, "error" => "Invalid review ID"]);
        exit;
    }

    // Verify the review exists and belongs to this user
    $stmt = $conn->prepare("
        SELECT id, product_id 
        FROM product_reviews 
        WHERE id = ? AND user_id = ? 
        LIMIT 1
    ");
    $stmt->bind_param("ii", $review_id, $user_id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        echo json_encode(["success" => false, "error" => "Review not found or unauthorized"]);
        exit;
    }

    $review = $result->fetch_assoc();
    $product_id = $review['product_id'];
    $stmt->close();

    // Delete the review (trigger will automatically update ratings)
    $stmt = $conn->prepare("DELETE FROM product_reviews WHERE id = ? AND user_id = ?");
    $stmt->bind_param("ii", $review_id, $user_id);

    if ($stmt->execute()) {
        $stmt->close();

        echo json_encode([
            "success" => true,
            "message" => "Review deleted successfully",
            "product_id" => $product_id
        ]);
    } else {
        echo json_encode(["success" => false, "error" => "Failed to delete review"]);
    }
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}

$conn->close();
