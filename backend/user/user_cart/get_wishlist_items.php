<?php
require_once __DIR__ . '/../../config/session_config.php';
include(__DIR__ . "/../../config/header.php");

try {
    if (!isset($_SESSION['user_email'])) {
        echo json_encode(['success' => false, 'error' => 'User not authenticated']);
        exit;
    }

    $user_email = $_SESSION['user_email'];
    $period = $_GET['period'] ?? 'Until now';

    // Get user_id
    $stmt = $conn->prepare("SELECT id FROM users WHERE email = ? LIMIT 1");
    $stmt->bind_param("s", $user_email);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();
    $stmt->close();

    if (!$user) {
        echo json_encode(['success' => false, 'error' => 'User not found']);
        exit;
    }

    $user_id = $user['id'];

    // Build date filter
    $date_filter = "";
    if ($period === 'This month') {
        $date_filter = "AND DATE_FORMAT(uw.added_at, '%Y-%m') = DATE_FORMAT(NOW(), '%Y-%m')";
    } elseif ($period === 'This year') {
        $date_filter = "AND YEAR(uw.added_at) = YEAR(NOW())";
    }

    // Get wishlist items
    $query = "
        SELECT 
            uw.id,
            uw.product_id as productId,
            uw.added_at as addedAt,
            p.product_name as productName,
            p.price,
            p.stock,
            p.status,
            p.category,
            pi.image_url as imageUrl,
            s.id as sellerId,
            s.store_name as storeName,
            s.store_logo as storeLogo
        FROM user_wishlist uw
        JOIN products p ON uw.product_id = p.id
        LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.`order` = 1
        JOIN sellers s ON p.seller_id = s.id
        WHERE uw.user_id = ?
        $date_filter
        ORDER BY uw.added_at DESC
    ";

    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();

    $wishlistItems = [];
    while ($row = $result->fetch_assoc()) {
        $wishlistItems[] = [
            'id' => (int)$row['id'],
            'productId' => (int)$row['productId'],
            'productName' => $row['productName'],
            'price' => (float)$row['price'],
            'stock' => (int)$row['stock'],
            'inStock' => $row['stock'] > 0 && $row['status'] === 'published',
            'category' => $row['category'],
            'productImage' => $row['imageUrl'],
            'storeName' => $row['storeName'],
            'storeLogo' => $row['storeLogo'],
            'sellerId' => (int)$row['sellerId'],
            'addedAt' => date("j F Y g:i A", strtotime($row['addedAt']))
        ];
    }
    $stmt->close();

    echo json_encode([
        'success' => true,
        'wishlistItems' => $wishlistItems,
        'period' => $period,
        'count' => count($wishlistItems)
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}

$conn->close();
