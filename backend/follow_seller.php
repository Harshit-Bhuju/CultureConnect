<?php
session_start();
include("header.php");

if (!isset($_SESSION['user_email'])) {
    echo json_encode(["status" => "error", "message" => "User not logged in"]);
    exit;
}

$user_email = $_SESSION['user_email'];
$seller_id = isset($_POST['seller_id']) ? intval($_POST['seller_id']) : null;
$action = isset($_POST['action']) ? $_POST['action'] : null; // 'follow' or 'unfollow'

if (!$seller_id || !$action) {
    echo json_encode(["status" => "error", "message" => "Invalid parameters"]);
    exit;
}

// Get user_id from email
$stmt = $conn->prepare("SELECT id FROM users WHERE email = ? LIMIT 1");
$stmt->bind_param("s", $user_email);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();
$stmt->close();

if (!$user) {
    echo json_encode(["status" => "error", "message" => "User not found"]);
    exit;
}

$user_id = $user['id'];

// Check if user is trying to follow their own seller profile
$stmt = $conn->prepare("SELECT id FROM sellers WHERE id = ? AND user_id = ? LIMIT 1");
$stmt->bind_param("ii", $seller_id, $user_id);
$stmt->execute();
$result = $stmt->get_result();
$is_own_profile = $result->num_rows > 0;
$stmt->close();

if ($is_own_profile) {
    echo json_encode(["status" => "error", "message" => "You cannot follow your own store"]);
    exit;
}

if ($action === 'follow') {
    // Check if already following
    $stmt = $conn->prepare("SELECT id FROM seller_followers WHERE user_id = ? AND seller_id = ? LIMIT 1");
    $stmt->bind_param("ii", $user_id, $seller_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $already_following = $result->num_rows > 0;
    $stmt->close();

    if ($already_following) {
        echo json_encode(["status" => "error", "message" => "Already following this seller"]);
        exit;
    }

    // Add follow relationship
    $stmt = $conn->prepare("INSERT INTO seller_followers (user_id, seller_id, created_at) VALUES (?, ?, NOW())");
    $stmt->bind_param("ii", $user_id, $seller_id);

    if ($stmt->execute()) {
        // Update followers count in sellers table
        $update_stmt = $conn->prepare("UPDATE sellers SET followers = followers + 1 WHERE id = ?");
        $update_stmt->bind_param("i", $seller_id);
        $update_stmt->execute();
        $update_stmt->close();

        // Get updated count
        $count_stmt = $conn->prepare("SELECT followers FROM sellers WHERE id = ? LIMIT 1");
        $count_stmt->bind_param("i", $seller_id);
        $count_stmt->execute();
        $count_result = $count_stmt->get_result();
        $seller_data = $count_result->fetch_assoc();
        $count_stmt->close();

        echo json_encode([
            "status" => "success",
            "message" => "Successfully followed seller",
            "is_following" => true,
            "followers_count" => $seller_data['followers'] ?? 0
        ]);
    } else {
        echo json_encode(["status" => "error", "message" => "Failed to follow seller"]);
    }
    $stmt->close();
} elseif ($action === 'unfollow') {
    // Remove follow relationship
    $stmt = $conn->prepare("DELETE FROM seller_followers WHERE user_id = ? AND seller_id = ?");
    $stmt->bind_param("ii", $user_id, $seller_id);

    if ($stmt->execute() && $stmt->affected_rows > 0) {
        // Update followers count in sellers table
        $update_stmt = $conn->prepare("UPDATE sellers SET followers = GREATEST(0, followers - 1) WHERE id = ?");
        $update_stmt->bind_param("i", $seller_id);
        $update_stmt->execute();
        $update_stmt->close();

        // Get updated count
        $count_stmt = $conn->prepare("SELECT followers FROM sellers WHERE id = ? LIMIT 1");
        $count_stmt->bind_param("i", $seller_id);
        $count_stmt->execute();
        $count_result = $count_stmt->get_result();
        $seller_data = $count_result->fetch_assoc();
        $count_stmt->close();

        echo json_encode([
            "status" => "success",
            "message" => "Successfully unfollowed seller",
            "is_following" => false,
            "followers_count" => $seller_data['followers'] ?? 0
        ]);
    } else {
        echo json_encode(["status" => "error", "message" => "Failed to unfollow seller"]);
    }
    $stmt->close();
} else {
    echo json_encode(["status" => "error", "message" => "Invalid action"]);
}

$conn->close();
exit;
