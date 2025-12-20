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
        echo json_encode(["success" => false, "error" => "Only sellers can reply to reviews"]);
        exit;
    }

    $seller_id = $user['seller_id'];

    // Get POST data
    $review_id = $_POST['review_id'] ?? null;
    $reply_text = $_POST['reply_text'] ?? null;
    $reply_id = $_POST['reply_id'] ?? null; // For editing

    // Validation
    if (!$review_id || !is_numeric($review_id)) {
        echo json_encode(["success" => false, "error" => "Invalid review ID"]);
        exit;
    }

    $reply_text = trim($reply_text);
    if (strlen($reply_text) < 10) {
        echo json_encode(["success" => false, "error" => "Reply must be at least 10 characters"]);
        exit;
    }

    if (strlen($reply_text) > 500) {
        echo json_encode(["success" => false, "error" => "Reply cannot exceed 500 characters"]);
        exit;
    }

    // Verify the review exists and belongs to seller's product
    $stmt = $conn->prepare("
        SELECT pr.id, pr.product_id, p.seller_id
        FROM product_reviews pr
        JOIN products p ON pr.product_id = p.id
        WHERE pr.id = ? AND p.seller_id = ?
        LIMIT 1
    ");
    $stmt->bind_param("ii", $review_id, $seller_id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        echo json_encode(["success" => false, "error" => "Review not found or unauthorized"]);
        exit;
    }
    $stmt->close();

    // Check if this is an edit or new reply
    if ($reply_id) {
        // UPDATE existing reply
        // First verify the reply belongs to this seller
        $stmt = $conn->prepare("
            SELECT id 
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
        $stmt->close();

        // Update the reply
        $stmt = $conn->prepare("
            UPDATE seller_review_replies 
            SET reply_text = ?, updated_at = NOW()
            WHERE id = ? AND seller_id = ?
        ");
        $stmt->bind_param("sii", $reply_text, $reply_id, $seller_id);

        if ($stmt->execute()) {
            $stmt->close();

            // Get the updated reply with seller info
            $stmt = $conn->prepare("
                SELECT 
                    srr.id,
                    srr.reply_text,
                    srr.created_at,
                    srr.updated_at,
                    s.store_name,
                    s.store_logo
                FROM seller_review_replies srr
                JOIN sellers s ON srr.seller_id = s.id
                WHERE srr.id = ?
            ");
            $stmt->bind_param("i", $reply_id);
            $stmt->execute();
            $result = $stmt->get_result();
            $reply = $result->fetch_assoc();
            $stmt->close();

            echo json_encode([
                "success" => true,
                "message" => "Reply updated successfully",
                "reply" => [
                    'id' => (int)$reply['id'],
                    'sellerId' => $seller_id,
                    'replyText' => $reply['reply_text'],
                    'storeName' => $reply['store_name'],
                    'storeLogo' => $reply['store_logo'],
                    'createdAt' => $reply['created_at'],
                    'updatedAt' => $reply['updated_at']
                ]
            ]);
        } else {
            echo json_encode(["success" => false, "error" => "Failed to update reply"]);
        }
    } else {
        // INSERT new reply
        // Check if seller already replied to this review
        $stmt = $conn->prepare("
            SELECT id 
            FROM seller_review_replies 
            WHERE review_id = ? AND seller_id = ? 
            LIMIT 1
        ");
        $stmt->bind_param("ii", $review_id, $seller_id);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            echo json_encode(["success" => false, "error" => "You have already replied to this review"]);
            exit;
        }
        $stmt->close();

        // Insert new reply
        $stmt = $conn->prepare("
            INSERT INTO seller_review_replies (review_id, seller_id, reply_text, created_at)
            VALUES (?, ?, ?, NOW())
        ");
        $stmt->bind_param("iis", $review_id, $seller_id, $reply_text);

        if ($stmt->execute()) {
            $reply_id = $conn->insert_id;
            $stmt->close();

            // Get the new reply with seller info
            $stmt = $conn->prepare("
                SELECT 
                    srr.id,
                    srr.reply_text,
                    srr.created_at,
                    s.store_name,
                    s.store_logo
                FROM seller_review_replies srr
                JOIN sellers s ON srr.seller_id = s.id
                WHERE srr.id = ?
            ");
            $stmt->bind_param("i", $reply_id);
            $stmt->execute();
            $result = $stmt->get_result();
            $reply = $result->fetch_assoc();
            $stmt->close();

            echo json_encode([
                "success" => true,
                "message" => "Reply submitted successfully",
                "reply" => [
                    'id' => (int)$reply['id'],
                    'sellerId' => $seller_id,
                    'replyText' => $reply['reply_text'],
                    'storeName' => $reply['store_name'],
                    'storeLogo' => $reply['store_logo'],
                    'createdAt' => $reply['created_at']
                ]
            ]);
        } else {
            echo json_encode(["success" => false, "error" => "Failed to submit reply"]);
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