<?php
session_start();
include("header.php");

try {
    $user_email = $_SESSION['user_email'];
    $product_id = $_GET['product_id'] ?? null;

    if (!$product_id || !is_numeric($product_id)) {
        echo json_encode(["success" => false, "error" => "Invalid product ID"]);
        exit;
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

    $seller_id = isset($_GET['seller_id']) && is_numeric($_GET['seller_id'])
        ? $_GET['seller_id']
        : $user['seller_id'];

    // Validate seller_id exists
    if (!$seller_id) {
        echo json_encode(["success" => false, "error" => "Seller ID not found"]);
        exit;
    }
    // Already getting seller_id
    $stmt = $conn->prepare("
    SELECT s.id as seller_id, s.store_name, s.store_logo
    FROM sellers s
    WHERE s.id = ?
    LIMIT 1
");
    $stmt->bind_param("i", $seller_id);
    $stmt->execute();
    $sellerData = $stmt->get_result()->fetch_assoc();
    $stmt->close();

    // Get product details with all fields
    $stmt = $conn->prepare("
    SELECT 
        p.id,
        p.product_name,
        p.product_type,
        p.category,
        p.audience,
        p.price,
        p.stock,
        p.description,
        p.dimensions,
        p.material,
        p.care_instructions,
        p.status,
        p.average_rating,
        p.total_reviews,
        p.total_sales,
        p.revenue,
        p.created_at,
        p.updated_at,
        GROUP_CONCAT(DISTINCT pi.image_url ORDER BY pi.`order` ASC, pi.id ASC) as images,
        GROUP_CONCAT(DISTINCT pt.tag) as tags
    FROM products p
    LEFT JOIN product_images pi ON p.id = pi.product_id
    LEFT JOIN product_tags pt ON p.id = pt.product_id
    WHERE p.id = ? AND p.status != 'deleted'
    GROUP BY p.id
    LIMIT 1
");
    $stmt->bind_param("i", $product_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $row = $result->fetch_assoc();
    $stmt->close();

    if (!$row) {
        echo json_encode(["success" => false, "error" => "Product not found or unauthorized"]);
        exit;
    }

    // Convert images and tags strings to arrays
    $images = $row['images'] ? explode(',', $row['images']) : [];
    $tags = $row['tags'] ? explode(',', $row['tags']) : [];

    // Initialize culture, sizes, and age groups
    $culture = null;
    $sizes = [];
    $ageGroups = [];

    // If category is cultural-clothes, get culture and size/age info
    if ($row['category'] === 'cultural-clothes') {
        $clothesStmt = $conn->prepare("
            SELECT 
                pc.culture,
                sao.size_available,
                sao.age_group
            FROM product_clothes pc
            LEFT JOIN size_age_options sao ON pc.size_age_id = sao.id
            WHERE pc.product_id = ?
        ");
        $clothesStmt->bind_param("i", $product_id);
        $clothesStmt->execute();
        $clothesResult = $clothesStmt->get_result();

        while ($clothesRow = $clothesResult->fetch_assoc()) {
            if (!$culture && $clothesRow['culture']) {
                $culture = $clothesRow['culture'];
            }

            if ($clothesRow['size_available']) {
                $sizes[] = $clothesRow['size_available'];
            }
            if ($clothesRow['age_group']) {
                $ageGroups[] = $clothesRow['age_group'];
            }
        }
        $clothesStmt->close();

        // Remove duplicates
        $sizes = array_unique($sizes);
        $ageGroups = array_unique($ageGroups);
    }

    // Get reviews with seller replies (FIXED QUERY)
    $reviewStmt = $conn->prepare("
        SELECT 
            pr.id,
            pr.user_id,
            pr.rating,
            pr.comment,
            pr.created_at,
            u.username,
            u.profile_pic,
            srr.id as reply_id,
            srr.reply_text,
            srr.created_at as reply_created_at,
            srr.updated_at as reply_updated_at,
            srr.seller_id as reply_seller_id,
            s.store_name as reply_store_name,
            s.store_logo as reply_store_logo
        FROM product_reviews pr
        JOIN users u ON pr.user_id = u.id
        LEFT JOIN seller_review_replies srr ON pr.id = srr.review_id
        LEFT JOIN sellers s ON srr.seller_id = s.id
        WHERE pr.product_id = ?
        ORDER BY pr.created_at DESC
    ");
    $reviewStmt->bind_param("i", $product_id);
    $reviewStmt->execute();
    $reviewResult = $reviewStmt->get_result();

    $reviewsMap = [];
    while ($review = $reviewResult->fetch_assoc()) {
        $review_id = $review['id'];

        // If this review doesn't exist in map yet, create it
        if (!isset($reviewsMap[$review_id])) {
            $reviewsMap[$review_id] = [
                'id' => (int)$review['id'],
                'userId' => (int)$review['user_id'],
                'rating' => (int)$review['rating'],
                'comment' => $review['comment'],
                'author' => $review['username'],
                'userImage' => $review['profile_pic'],
                'date' => $review['created_at'], // Keep as datetime for proper sorting
                'replies' => []
            ];
        }

        // If there's a seller reply, add it to the replies array
        if ($review['reply_id']) {
            $reviewsMap[$review_id]['replies'][] = [
                'id' => (int)$review['reply_id'],
                'sellerId' => (int)$review['reply_seller_id'],
                'replyText' => $review['reply_text'],
                'storeName' => $review['reply_store_name'],
                'storeLogo' => $review['reply_store_logo'],
                'createdAt' => $review['reply_created_at'],
                'updatedAt' => $review['reply_updated_at']
            ];
        }
    }
    $reviewStmt->close();

    // Convert map to array
    $reviews = array_values($reviewsMap);

    // Convert status
    $status = ucfirst($row['status']);
    if ($status === 'Published') {
        $status = 'Active';
    }

    $product = [
        'id' => (int)$row['id'],
        'sellerId' => (int)$seller_id,
        'storeName' => $sellerData['store_name'] ?? 'Seller',
        'storeLogo' => $sellerData['store_logo'] ?? null,
        'productName' => $row['product_name'],
        'name' => $row['product_name'],
        'productType' => $row['product_type'],
        'category' => $row['category'],
        'audience' => $row['audience'],
        'culture' => $culture,
        'sizes' => array_values($sizes),
        'ageGroups' => array_values($ageGroups),
        'price' => (float)$row['price'],
        'stock' => (int)$row['stock'],
        'description' => $row['description'],
        'dimensions' => $row['dimensions'],
        'material' => $row['material'],
        'careInstructions' => $row['care_instructions'],
        'status' => $status,
        'images' => $images,
        'tags' => $tags,
        'reviews' => $reviews,
        'averageRating' => (float)$row['average_rating'],
        'totalReviews' => (int)$row['total_reviews'],
        'totalSales' => (int)$row['total_sales'],
        'revenue' => (float)$row['revenue'],
        'createdAt' => $row['created_at'],
        'updatedAt' => $row['updated_at']
    ];

    echo json_encode([
        'success' => true,
        'product' => $product
    ]);
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}

$conn->close();
