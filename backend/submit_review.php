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
    $product_id = $_POST['product_id'] ?? null;
    $rating = $_POST['rating'] ?? null;
    $comment = $_POST['comment'] ?? null;
    $review_id = $_POST['review_id'] ?? null; // For editing

    // Validation
    if (!$product_id || !is_numeric($product_id)) {
        echo json_encode(["success" => false, "error" => "Invalid product ID"]);
        exit;
    }

    if (!$rating || !is_numeric($rating) || $rating < 1 || $rating > 5) {
        echo json_encode(["success" => false, "error" => "Rating must be between 1 and 5"]);
        exit;
    }

    $comment = trim($comment);
    if (strlen($comment) < 10) {
        echo json_encode(["success" => false, "error" => "Review must be at least 10 characters"]);
        exit;
    }

    if (strlen($comment) > 500) {
        echo json_encode(["success" => false, "error" => "Review cannot exceed 500 characters"]);
        exit;
    }

    // Check if product exists
    $stmt = $conn->prepare("SELECT id FROM products WHERE id = ? AND status != 'deleted' LIMIT 1");
    $stmt->bind_param("i", $product_id);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($result->num_rows === 0) {
        echo json_encode(["success" => false, "error" => "Product not found"]);
        exit;
    }
    $stmt->close();

    // Check if this is an edit or new review
    if ($review_id) {
        // UPDATE existing review
        // First verify the review belongs to this user
        $stmt = $conn->prepare("SELECT id FROM product_reviews WHERE id = ? AND user_id = ? LIMIT 1");
        $stmt->bind_param("ii", $review_id, $user_id);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows === 0) {
            echo json_encode(["success" => false, "error" => "Review not found or unauthorized"]);
            exit;
        }
        $stmt->close();

        // Update the review
        $stmt = $conn->prepare("
            UPDATE product_reviews 
            SET rating = ?, comment = ?, updated_at = NOW()
            WHERE id = ? AND user_id = ?
        ");
        $stmt->bind_param("isii", $rating, $comment, $review_id, $user_id);

        if ($stmt->execute()) {
            $stmt->close();

            // Get the updated review with user info
            $stmt = $conn->prepare("
                SELECT 
                    pr.id,
                    pr.rating,
                    pr.comment,
                    pr.created_at,
                    u.username,
                    u.profile_pic
                FROM product_reviews pr
                JOIN users u ON pr.user_id = u.id
                WHERE pr.id = ?
            ");
            $stmt->bind_param("i", $review_id);
            $stmt->execute();
            $result = $stmt->get_result();
            $review = $result->fetch_assoc();
            $stmt->close();

            echo json_encode([
                "success" => true,
                "message" => "Review updated successfully",
                "review" => [
                    'id' => (int)$review['id'],
                    'userId' => $user_id,
                    'rating' => (int)$review['rating'],
                    'comment' => $review['comment'],
                    'author' => $review['username'],
                    'userImage' => $review['profile_pic'],
                    'date' => $review['created_at']
                ]
            ]);
        } else {
            echo json_encode(["success" => false, "error" => "Failed to update review"]);
        }
    } else {
        // INSERT new review
        // Check if user already reviewed this product
        $stmt = $conn->prepare("
            SELECT id FROM product_reviews 
            WHERE product_id = ? AND user_id = ? 
            LIMIT 1
        ");
        $stmt->bind_param("ii", $product_id, $user_id);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            echo json_encode(["success" => false, "error" => "You have already reviewed this product"]);
            exit;
        }
        $stmt->close();

        // Insert new review
        $stmt = $conn->prepare("
            INSERT INTO product_reviews (product_id, user_id, rating, comment, created_at)
            VALUES (?, ?, ?, ?, NOW())
        ");
        $stmt->bind_param("iiis", $product_id, $user_id, $rating, $comment);

        if ($stmt->execute()) {
            $review_id = $conn->insert_id;
            $stmt->close();

            // Get the new review with user info
            $stmt = $conn->prepare("
                SELECT 
                    pr.id,
                    pr.rating,
                    pr.comment,
                    pr.created_at,
                    u.username,
                    u.profile_pic
                FROM product_reviews pr
                JOIN users u ON pr.user_id = u.id
                WHERE pr.id = ?
            ");
            $stmt->bind_param("i", $review_id);
            $stmt->execute();
            $result = $stmt->get_result();
            $review = $result->fetch_assoc();
            $stmt->close();

            echo json_encode([
                "success" => true,
                "message" => "Review submitted successfully",
                "review" => [
                    'id' => (int)$review['id'],
                    'userId' => $user_id,
                    'rating' => (int)$review['rating'],
                    'comment' => $review['comment'],
                    'author' => $review['username'],
                    'userImage' => $review['profile_pic'],
                    'date' => date('j F Y', strtotime($review['created_at'])),
                ]
            ]);
        } else {
            echo json_encode(["success" => false, "error" => "Failed to submit review"]);
        }
    }
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}

$conn->close();
