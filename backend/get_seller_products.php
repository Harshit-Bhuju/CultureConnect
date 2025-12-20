<?php
session_start();
include("header.php");
try {
    if (!isset($_SESSION['user_email'])) {
        echo json_encode(["success" => false, "error" => "User not logged in"]);
        exit;
    }

    $user_email = $_SESSION['user_email'];

    // Fetch user and seller info
    $stmt = $conn->prepare("SELECT u.id, s.id as seller_id FROM users u LEFT JOIN sellers s ON u.id = s.user_id WHERE u.email = ? LIMIT 1");
    $stmt->bind_param("s", $user_email);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();
    $stmt->close();

    if (!$user) {
        echo json_encode(["success" => false, "error" => "User not found"]);
        exit;
    }

    $seller_id = isset($_GET['seller_id']) ? (int)$_GET['seller_id'] : $user['seller_id'];

    // Get all products for this seller with images
    $query = "
        SELECT 
            p.id,
            p.product_name,
            p.category,
            p.price,
            p.stock,
            p.description,
            p.status,
            p.average_rating,
            p.total_reviews,
            p.total_sales,
            p.created_at,
            p.updated_at,
            GROUP_CONCAT(DISTINCT pi.image_url ORDER BY pi.`order` ASC, pi.id ASC) as images
        FROM products p
        LEFT JOIN product_images pi ON p.id = pi.product_id
        WHERE p.seller_id = ? AND p.status != 'deleted'
        GROUP BY p.id
        ORDER BY p.created_at DESC
    ";

    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $seller_id); // FIX: Changed from $sellerId to $seller_id
    $stmt->execute();
    $result = $stmt->get_result();

    $products = [];
    while ($row = $result->fetch_assoc()) {
        // Convert images string to array
        $images = $row['images'] ? explode(',', $row['images']) : [];

        // Get reviews for this product
        $reviewStmt = $conn->prepare("
            SELECT 
                pr.id,
                pr.rating,
                pr.comment,
                pr.created_at,
                u.username,
                u.profile_pic
            FROM product_reviews pr
            JOIN users u ON pr.user_id = u.id
            WHERE pr.product_id = ?
            ORDER BY pr.created_at DESC
        ");
        $reviewStmt->bind_param("i", $row['id']);
        $reviewStmt->execute();
        $reviewResult = $reviewStmt->get_result();

        $reviews = [];
        while ($review = $reviewResult->fetch_assoc()) {
            $reviews[] = [
                'id' => (int)$review['id'],
                'rating' => (int)$review['rating'],
                'comment' => $review['comment'],
                'username' => $review['username'],
                'userImage' => $review['profile_pic'],
                'date' => $review['created_at']
            ];
        }
        $reviewStmt->close();

        // FIX: Convert status properly - 'published' becomes 'Active'
        $displayStatus = $row['status'] === 'published' ? 'Active' : ucfirst($row['status']);

        $products[] = [
            'id' => (int)$row['id'],
            'sellerId' => (int)$seller_id,
            'productName' => $row['product_name'],
            'name' => $row['product_name'], // Alias for compatibility
            'category' => $row['category'],
            'price' => (float)$row['price'],
            'stock' => (int)$row['stock'],
            'description' => $row['description'],
            'status' => $displayStatus, // FIX: Now returns 'Active' instead of 'Published'
            'images' => $images,
            'reviews' => $reviews,
            'averageRating' => (float)$row['average_rating'],
            'totalReviews' => (int)$row['total_reviews'],
            'totalSales' => (int)$row['total_sales'],
            'createdAt' => $row['created_at'],
            'updatedAt' => $row['updated_at']
        ];
    }
    $stmt->close();

    // Get seller statistics
    $statsQuery = "
        SELECT 
         COUNT(CASE WHEN status IN ('draft','published') THEN 1 END) as total_products, 
            COUNT(CASE WHEN status = 'published' THEN 1 END) as active_products,
            SUM(CASE WHEN status = 'published' AND stock <= 10 THEN 1 ELSE 0 END) as low_stock_products,
            SUM(CASE WHEN status = 'published' THEN price * stock ELSE 0 END) as inventory_value
        FROM products
        WHERE seller_id = ? AND status != 'deleted'
    ";

    $statsStmt = $conn->prepare($statsQuery);
    $statsStmt->bind_param("i", $seller_id); // FIX: Use $seller_id
    $statsStmt->execute();
    $statsResult = $statsStmt->get_result();
    $stats = $statsResult->fetch_assoc();
    $statsStmt->close();

    echo json_encode([
        'success' => true,
        'products' => $products,
        'stats' => [
            'totalProducts' => (int)$stats['total_products'],
            'activeProducts' => (int)$stats['active_products'],
            'lowStockProducts' => (int)$stats['low_stock_products'],
            'inventoryValue' => (float)$stats['inventory_value']
        ]
    ]);
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}

$conn->close();
